import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { fetchPostPageBySlug, pageToPostIndex } from './notion';
import type { NotionPostDetail } from './notionTypes';

// ---------------------------------------------------------------------------
// notion-to-md converter
// ---------------------------------------------------------------------------

function createN2M(notionClient: Client): NotionToMarkdown {
  return new NotionToMarkdown({
    notionClient: notionClient as ConstructorParameters<typeof NotionToMarkdown>[0]['notionClient'],
    config: { parseChildPages: false },
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch a single post by slug, convert its blocks to markdown, and return
 * a fully hydrated NotionPostDetail (index metadata + content).
 */
export async function fetchPostDetail(
  slug: string,
): Promise<NotionPostDetail | null> {
  const page = await fetchPostPageBySlug(slug);
  if (!page) return null;

  const index = pageToPostIndex(page);

  // Build Notion client for notion-to-md (needs its own instance)
  const secret = process.env.NOTION_SECRET;
  if (!secret) throw new Error('Missing NOTION_SECRET environment variable');
  const notionClient = new Client({ auth: secret });
  const n2m = createN2M(notionClient);

  // Convert page blocks to markdown
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);
  const content = mdString.parent ?? '';

  // Estimate read time from word count
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

  return {
    ...index,
    readTime,
    content,
  };
}
