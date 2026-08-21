import { prisma } from '@/lib/prisma';
import ConstructionListClient from './ConstructionListClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Construction Status | Prime Properties BD',
    description: 'Explore the latest construction progress updates for Prime Properties BD projects.',
};

export default async function ConstructionPage() {
    const projects = await prisma.constructionProject.findMany({
        where: { published: true },
        include: {
            progressItems: { orderBy: { sortOrder: 'asc' } }
        },
        orderBy: { createdAt: 'desc' },
    });

    return <ConstructionListClient projects={projects as any} />;
}
