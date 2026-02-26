import { NextRequest, NextResponse } from 'next/server';
import { fetchPageComments, createPageComment } from '@/lib/notion';

export const revalidate = 60; // revalidate comments every 60 seconds

/**
 * GET /api/comments/[pageId]
 * Fetch all open comments for a Notion page.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> },
) {
  const { pageId } = await params;

  try {
    const comments = await fetchPageComments(pageId);
    return NextResponse.json(comments);
  } catch (err) {
    console.error('Failed to fetch comments:', err);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/comments/[pageId]
 * Create a new page-level comment.
 * Body: { text: string, displayName?: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> },
) {
  const { pageId } = await params;

  try {
    const body = await request.json();
    const { text, displayName } = body as { text?: string; displayName?: string };

    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'Comment text is required' },
        { status: 400 },
      );
    }

    // Basic length limit
    if (text.length > 2000) {
      return NextResponse.json(
        { error: 'Comment text exceeds 2000 character limit' },
        { status: 400 },
      );
    }

    const comment = await createPageComment(pageId, text.trim(), displayName);
    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error('Failed to create comment:', err);
    // Surface the Notion API error details for debugging
    const message = err instanceof Error ? err.message : 'Unknown error';
    const isPermission = message.includes('403') || message.includes('Forbidden') || message.includes('insufficient permissions');
    return NextResponse.json(
      { 
        error: isPermission 
          ? 'Notion integration lacks comment permissions. Enable "Insert comments" in Notion integration settings.'
          : `Failed to create comment: ${message}`,
      },
      { status: isPermission ? 403 : 500 },
    );
  }
}
