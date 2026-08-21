import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ConstructionDetailClient from './ConstructionDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await prisma.constructionProject.findUnique({
        where: { slug }
    });
    if (!project) return { title: 'Not Found' };
    return {
        title: `${project.title} – Construction Status | Prime Properties BD`,
        description: `Track the construction progress details for ${project.title} located at ${project.location || 'Dhaka'}.`,
    };
}

export default async function ConstructionDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const project = await prisma.constructionProject.findUnique({
        where: { slug },
        include: {
            progressItems: {
                orderBy: { sortOrder: 'asc' }
            }
        }
    });

    if (!project || !project.published) {
        notFound();
    }

    return <ConstructionDetailClient project={project as any} />;
}
