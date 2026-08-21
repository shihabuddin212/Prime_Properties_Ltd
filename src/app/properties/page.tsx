import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import PropertiesListClient from '@/components/properties/PropertiesListClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'All Properties | Prime Properties BD',
    description: 'Browse luxury apartments, commercial spaces, and joint venture opportunities across Dhaka, Gulshan, Dhanmondi, Mirpur, and Chattogram.',
};

export default async function PropertiesPage() {
    const properties = await prisma.property.findMany({
        where: { published: true },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });

    return (
        <Suspense fallback={
            <div className="pt-20 min-h-screen bg-white dark:bg-primary-navy/40 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <PropertiesListClient initialProperties={properties as any} />
        </Suspense>
    );
}
