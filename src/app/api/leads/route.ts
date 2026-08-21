import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, email, message, visitDate, propertyId, propertyTitle } = body;

        if (!name || !phone) {
            return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
        }

        const lead = await prisma.lead.create({
            data: {
                name,
                phone,
                email: email || '',
                message: message || '',
                visitDate: visitDate || '',
                propertyId: propertyId || '',
                propertyTitle: propertyTitle || '',
                status: 'New',
            },
        });

        return NextResponse.json({ success: true, id: lead.id });
    } catch (error) {
        console.error('Lead API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(leads);
    } catch (error) {
        console.error('Leads GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
