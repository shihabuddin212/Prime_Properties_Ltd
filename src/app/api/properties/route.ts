import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const location = searchParams.get('location');

    // Build filter
    const where: any = { published: true };
    if (status) where.status = status;
    if (location) {
        where.location = {
            contains: location,
        };
    }

    const properties = await prisma.property.findMany({
        where,
        select: {
            id: true,
            title: true,
            slug: true,
            location: true,
            status: true,
            price: true,
            sqft: true,
            beds: true,
            images: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(properties);
}
