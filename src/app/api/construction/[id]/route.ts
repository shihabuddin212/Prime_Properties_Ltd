import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RouteContext {
    params: Promise<{ id: string }>
}

export async function GET(req: Request, { params }: RouteContext) {
    try {
        const { id } = await params;
        const project = await prisma.constructionProject.findUnique({
            where: { id },
            include: {
                progressItems: {
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: RouteContext) {
    try {
        const { id } = await params;
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

        // Deleting existing progressItems and recreating is clean and handles deletes/inserts/updates gracefully in one transaction
        const updatedProject = await prisma.$transaction(async (tx) => {
            // Check existence
            const existing = await tx.constructionProject.findUnique({ where: { id } });
            if (!existing) {
                throw new Error('Project not found');
            }

            // Remove existing progress items
            await tx.progressItem.deleteMany({
                where: { projectId: id }
            });

            // Update project information, and create the new set of progressItems
            return await tx.constructionProject.update({
                where: { id },
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
                    progressItems: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            });
        });

        return NextResponse.json(updatedProject);
    } catch (e: any) {
        console.error(e);
        if (e.message === 'Project not found') {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: RouteContext) {
    try {
        const { id } = await params;

        const existing = await prisma.constructionProject.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        await prisma.constructionProject.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Project deleted successfully' });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
