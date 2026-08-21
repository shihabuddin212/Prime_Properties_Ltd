import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
    const { id, status } = await req.json();
    const lead = await prisma.lead.update({ where: { id }, data: { status } });
    return NextResponse.json(lead);
}
