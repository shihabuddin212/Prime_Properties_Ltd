import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const trimmedUrl = url.trim();

        // 1. If it's already a base64 data URI, return it directly
        if (trimmedUrl.startsWith('data:image')) {
            return NextResponse.json({ base64: [trimmedUrl] });
        }

        // 2. Fetch the target URL
        const response = await fetch(trimmedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: 400 });
        }

        const contentType = response.headers.get('content-type') || '';

        // 3. If the URL is a direct image
        if (contentType.startsWith('image/')) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = `data:${contentType};base64,${buffer.toString('base64')}`;
            return NextResponse.json({ base64: [base64] });
        }

        // 4. If the URL is an HTML webpage, let's scrape images
        if (contentType.includes('text/html')) {
            const html = await response.text();

            // Extract all image URLs from img src
            const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
            const scrapedUrls: string[] = [];
            let match;
            const parsedUrl = new URL(trimmedUrl);
            const origin = parsedUrl.origin;

            while ((match = imgRegex.exec(html)) !== null) {
                let imgUrl = match[1];
                if (!imgUrl) continue;

                // Resolve relative paths to absolute URLs
                if (imgUrl.startsWith('//')) {
                    imgUrl = `https:${imgUrl}`;
                } else if (imgUrl.startsWith('/')) {
                    imgUrl = `${origin}${imgUrl}`;
                } else if (!imgUrl.startsWith('http://') && !imgUrl.startsWith('https://') && !imgUrl.startsWith('data:')) {
                    // Path relative
                    const basePath = trimmedUrl.substring(0, trimmedUrl.lastIndexOf('/') + 1);
                    imgUrl = `${basePath}${imgUrl}`;
                }
                scrapedUrls.push(imgUrl);
            }

            // Exclude common tracking design icons (e.g. logos, tiny pixels)
            const cleanImageUrls = scrapedUrls.filter(u => {
                const low = u.toLowerCase();
                return !low.includes('logo') && !low.includes('icon') && !low.includes('avatar') && !low.includes('button');
            });

            // Filter for floor plan candidates: search for relevant keywords
            const keywords = ['floor', 'plan', 'layout', 'schematic', 'blueprint', 'map', 'drawing'];
            let candidates = cleanImageUrls.filter(u => {
                const low = u.toLowerCase();
                return keywords.some(kw => low.includes(kw));
            });

            // Fallback: If no floor plan keywords match, just take any valid image extensions
            if (candidates.length === 0) {
                candidates = cleanImageUrls.filter(u => {
                    const low = u.toLowerCase();
                    return low.includes('.jpg') || low.includes('.jpeg') || low.includes('.png') || low.includes('.webp');
                });
            }

            // Filter out duplicates
            const uniqueCandidates = Array.from(new Set(candidates)).slice(0, 3); // Fetch at most 3 images

            if (uniqueCandidates.length === 0) {
                return NextResponse.json({ error: 'No images found on the webpage' }, { status: 404 });
            }

            const base64s: string[] = [];
            for (const imgUrl of uniqueCandidates) {
                try {
                    const imgRes = await fetch(imgUrl, {
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    });
                    if (imgRes.ok) {
                        const imgContentType = imgRes.headers.get('content-type') || 'image/jpeg';
                        const buf = Buffer.from(await imgRes.arrayBuffer());
                        base64s.push(`data:${imgContentType};base64,${buf.toString('base64')}`);
                    }
                } catch (err) {
                    console.error(`Failed to download scraped image: ${imgUrl}`, err);
                }
            }

            if (base64s.length > 0) {
                return NextResponse.json({ base64: base64s });
            } else {
                return NextResponse.json({ error: 'Failed to download any images from the page' }, { status: 400 });
            }
        }

        // 5. Fallback download: attempt to download even if content-type is generic/missing
        try {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
            return NextResponse.json({ base64: [base64] });
        } catch {
            return NextResponse.json({ error: 'Unsupported content type or invalid image data' }, { status: 400 });
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
