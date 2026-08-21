import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(testimonials);
}

export async function POST(req: Request) {
    const data = await req.json();
    const testimonial = await prisma.testimonial.create({ data });
    return NextResponse.json(testimonial);
}

export async function PUT(req: Request) {
    const { id, ...data } = await req.json();
    const testimonial = await prisma.testimonial.update({ where: { id }, data });
    return NextResponse.json(testimonial);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
