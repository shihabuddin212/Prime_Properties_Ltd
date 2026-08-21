import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const albums = await prisma.galleryAlbum.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(albums);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch gallery albums' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const album = await prisma.galleryAlbum.create({
            data: {
                title: body.title,
                category: body.category,
                images: body.images ?? '',
                published: body.published ?? true,
            },
        });
        return NextResponse.json(album, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to create gallery album' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;
        const album = await prisma.galleryAlbum.update({
            where: { id },
            data: {
                title: data.title,
                category: data.category,
                images: data.images ?? '',
                published: data.published ?? true,
            },
        });
        return NextResponse.json(album);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to update gallery album' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        await prisma.galleryAlbum.delete({ where: { id: body.id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to delete gallery album' }, { status: 500 });
    }
}
