import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message, subject, type } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const newMessage = await prisma.message.create({
            data: {
                name: name || (type === 'Newsletter' ? 'Newsletter Subscriber' : 'Website Visitor'),
                email: email.trim(),
                subject: subject || (type === 'Newsletter' ? 'Newsletter Subscription' : 'General Inquiry'),
                message: message || (type === 'Newsletter' ? 'Subscribed to newsletter updates from footer.' : ''),
                type: type || 'Contact',
                isRead: false,
            },
        });

        return NextResponse.json({ success: true, message: newMessage });
    } catch (error) {
        console.error('Public Messages API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
