import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const offers = await prisma.specialOffer.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(offers);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const offer = await prisma.specialOffer.create({
            data: {
                title: data.title,
                slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                location: data.location,
                sizeRange: data.sizeRange,
                beds: data.beds,
                baths: data.baths,
                land: data.land,
                image: data.image,
                logoBadge: data.logoBadge || data.title.toUpperCase(),
            }
        });
        return NextResponse.json(offer);
    } catch (error) {
        console.error('Error creating special offer:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, ...data } = await req.json();
        const offer = await prisma.specialOffer.update({
            where: { id },
            data: {
                title: data.title,
                slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                location: data.location,
                sizeRange: data.sizeRange,
                beds: data.beds,
                baths: data.baths,
                land: data.land,
                image: data.image,
                logoBadge: data.logoBadge || data.title.toUpperCase(),
            }
        });
        return NextResponse.json(offer);
    } catch (error) {
        console.error('Error updating special offer:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await prisma.specialOffer.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting special offer:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
