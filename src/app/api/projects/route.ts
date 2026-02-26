import { NextRequest, NextResponse } from 'next/server';
import { fetchPublishedProjects } from '@/lib/notion';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // ISR: revalidate every 5 minutes

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
    const projects = await fetchPublishedProjects(Number.isFinite(limit) ? limit : undefined);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects from Notion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 },
    );
  }
}
