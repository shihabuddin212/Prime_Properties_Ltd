import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { message, sessionId } = await request.json();

        if (!message || !sessionId) {
            return NextResponse.json({ error: 'Message and sessionId are required' }, { status: 400 });
        }

        const cleanMessage = message.trim().toLowerCase();

        // 1. Log the user's message to the DB
        await prisma.chatMessage.create({
            data: {
                sessionId,
                sender: 'user',
                message: message.trim(),
            },
        });

        // 2. Fetch all active FAQ entries
        const faqs = await prisma.chatbotFAQ.findMany({
            where: { isActive: true },
        });

        // 3. Find the best matching trigger
        let matchedReply = '';
        for (const faq of faqs) {
            const triggerWord = faq.trigger.toLowerCase();
            // Match query containing trigger word OR matching keyword
            if (cleanMessage.includes(triggerWord) || triggerWord.includes(cleanMessage)) {
                matchedReply = faq.response;
                break;
            }
        }

        // 4. Default fallback answer if no triggers match
        if (!matchedReply) {
            matchedReply = `Thank you for your message. I'm a digital assistant at Prime Properties BD. To help you with specific property details or site bookings, could you please share your Phone Number? 

Alternatively, feel free to call our executive team directly at 01829-116107 / 09639116107 or email arif@primepropertiesbd.com.`;
        }

        // 5. Log the bot's reply to the DB
        await prisma.chatMessage.create({
            data: {
                sessionId,
                sender: 'bot',
                message: matchedReply,
            },
        });

        return NextResponse.json({ reply: matchedReply });
    } catch (error: any) {
        console.error('Chatbot API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
