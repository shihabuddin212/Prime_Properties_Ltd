import { prisma } from '@/lib/prisma';
import GalleryClient from './GalleryClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Gallery | Prime Properties BD',
    description: 'A curated archive of Prime Properties BD customer events, corporate programs, and social initiatives.',
};

export default async function GalleryPage() {
    const albums = await prisma.galleryAlbum.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    });

    return <GalleryClient albums={albums as any} />;
}
