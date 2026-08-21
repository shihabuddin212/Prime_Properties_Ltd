import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const faqs = await prisma.chatbotFAQ.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(faqs);
}
export async function POST(req: Request) {
    const data = await req.json();
    const faq = await prisma.chatbotFAQ.create({ data });
    return NextResponse.json(faq);
}
export async function PUT(req: Request) {
    const { id, ...data } = await req.json();
    const faq = await prisma.chatbotFAQ.update({ where: { id }, data });
    return NextResponse.json(faq);
}
export async function DELETE(req: Request) {
    const { id } = await req.json();
    await prisma.chatbotFAQ.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
