import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseImages } from '@/lib/imageParser';

export async function GET() {
    try {
        // ONLY fetch from Property model where isSpecialOffer: true
        // This ensures every card links to a valid /properties/[slug] detail page
        const properties = await prisma.property.findMany({
            where: { isSpecialOffer: true, published: true },
            orderBy: { createdAt: 'desc' },
        });

        const mapped = properties.map(p => {
            const imgPaths = parseImages(p.images);
            const primaryImg = imgPaths[0] || 'https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=600';
            return {
                id: p.id,
                title: p.title,
                slug: p.slug,           // Direct match to /properties/[slug] detail page
                location: p.location,
                sizeRange: `${p.sqft} sft`,
                beds: String(p.beds),
                baths: String(p.baths),
                land: p.land,
                image: primaryImg,
                logoBadge: p.title.toUpperCase(),
            };
        });

        return NextResponse.json(mapped);
    } catch (error) {
        console.error('Error fetching special offers:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
