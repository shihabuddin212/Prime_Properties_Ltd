/**
 * Cleaning helpers for user inputs, such as Google Maps iframe strings and Google Image Search redirects.
 */

export function cleanImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    const trimmed = url.trim();

    // Handle Google Image search page redirects (e.g., https://www.google.com/imgres?imgurl=ACTUAL_URL&...)
    if (trimmed.includes('imgurl=')) {
        try {
            // First attempt: URL parsing
            const parsedObj = new URL(trimmed);
            const imgurl = parsedObj.searchParams.get('imgurl');
            if (imgurl) {
                return decodeURIComponent(imgurl);
            }
        } catch (e) {
            // Fallback: Regex query parameter match
            const match = trimmed.match(/[?&]imgurl=([^&]+)/);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        }
    }
    return trimmed;
}

/**
 * Safely parses property images and floor plans stored in SQLite TEXT columns.
 * Prevents base64 data url corruption caused by standard comma splitting,
 * by prioritizing pipe separators (`|`) and dynamically reconstructing comma-split base64 rows.
 * Also cleans up any Google Image redirects.
 */
export function parseImages(str: string | null | undefined): string[] {
    if (!str) return [];

    let array: string[] = [];

    // Case 1: New robust separator format (pipe '|')
    if (str.includes('|')) {
        array = str.split('|').map(s => s.trim()).filter(Boolean);
    }
    // Case 2: Repair and parse comma-split base64 images
    else if (str.includes('base64,')) {
        const parts = str.split(',').map(s => s.trim()).filter(Boolean);
        const result: string[] = [];
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].startsWith('data:')) {
                // Combine matching data-URI header with the subsequent base64 body segment
                if (i + 1 < parts.length) {
                    result.push(parts[i] + ',' + parts[i + 1]);
                    i++; // Skip index of body segment
                } else {
                    result.push(parts[i]);
                }
            } else {
                result.push(parts[i]);
            }
        }
        array = result;
    }
    // Case 3: Fallback for clean comma-separated lists of HTTP URLs
    else {
        array = str.split(',').map(s => s.trim()).filter(Boolean);
    }

    return array.map(cleanImageUrl);
}

/**
 * Safely extracts the clean web URL from a Google Maps embed iframe code or standard input.
 */
export function cleanMapUrl(url: string | null | undefined): string {
    if (!url) return '';
    const trimmed = url.trim();

    // Check if the input contains iframe HTML tags
    if (trimmed.toLowerCase().includes('<iframe')) {
        const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
        if (srcMatch && srcMatch[1]) {
            return srcMatch[1];
        }
    }
    return trimmed;
}
