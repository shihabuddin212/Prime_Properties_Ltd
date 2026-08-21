import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const projects = await prisma.constructionProject.findMany({
            include: {
                progressItems: {
                    orderBy: { sortOrder: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(projects);
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        // Generate slug from title if not set
        const rawSlug = body.slug || body.title;
        const slug = rawSlug
            .toLowerCase()
            .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
            .replace(/(^-|-$)/g, '') || `project-${Date.now()}`;

        // Create Project along with related ProgressItems
        const project = await prisma.constructionProject.create({
            data: {
                title: body.title,
                slug,
                location: body.location || '',
                expectedCompletionDate: body.expectedCompletionDate || '',
                statusUpdateDate: body.statusUpdateDate || '',
                featuredImage: body.featuredImage || '',
                logoUrl: body.logoUrl || '',
                published: body.published ?? true,
                progressItems: {
                    create: (body.progressItems || []).map((item: any, idx: number) => ({
                        slNo: item.slNo || String(idx + 1).padStart(2, '0'),
                        workName: item.workName || '',
                        progressDetails: item.progressDetails || '',
                        sortOrder: item.sortOrder ?? idx
                    }))
                }
            },
            include: {
                progressItems: true
            }
        });

        return NextResponse.json(project, { status: 201 });
    } catch (e: any) {
        console.error(e);
        if (e.code === 'P2002') {
            return NextResponse.json({ error: 'A project with this title or slug already exists.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
