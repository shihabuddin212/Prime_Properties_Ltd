import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Admin Messages GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message, type, isRead } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        const newMessage = await prisma.message.create({
            data: {
                name,
                email: email.trim(),
                subject: subject || 'General Inquiry',
                message: message || '',
                type: type || 'Contact',
                isRead: isRead ?? false,
            },
        });

        return NextResponse.json({ success: true, message: newMessage });
    } catch (error) {
        console.error('Admin Messages POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, email, subject, message, type, isRead } = body;

        if (!id) {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }

        const updatedMessage = await prisma.message.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email: email.trim() }),
                ...(subject !== undefined && { subject }),
                ...(message !== undefined && { message }),
                ...(type !== undefined && { type }),
                ...(isRead !== undefined && { isRead }),
            },
        });

        return NextResponse.json({ success: true, message: updatedMessage });
    } catch (error) {
        console.error('Admin Messages PUT Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }

        await prisma.message.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin Messages DELETE Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
