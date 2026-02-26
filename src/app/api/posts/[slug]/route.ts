import { NextResponse } from 'next/server';
import { fetchPostDetail } from '@/lib/notionMarkdown';

export const revalidate = 300; // ISR: revalidate every 5 minutes

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const post = await fetchPostDetail(slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to fetch post from Notion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 },
    );
  }
}
