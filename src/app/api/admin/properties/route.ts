import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const properties = await prisma.property.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(properties);
}

export async function POST(req: Request) {
    const data = await req.json();
    const property = await prisma.property.create({ data });
    return NextResponse.json(property);
}

export async function PUT(req: Request) {
    const { id, ...data } = await req.json();
    const property = await prisma.property.update({ where: { id }, data });
    return NextResponse.json(property);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
