import { Client, isFullPage } from '@notionhq/client';
import type {
  PageObjectResponse,
  QueryDataSourceParameters,
} from '@notionhq/client';
import type { NotionPostIndex, NotionProject, NotionComment } from './notionTypes';

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

function getNotionClient(): Client {
  const secret = process.env.NOTION_SECRET;
  if (!secret) {
    throw new Error('Missing NOTION_SECRET environment variable');
  }
  return new Client({ auth: secret });
}

function getDatabaseId(): string {
  const id = process.env.NOTION_DATABASE_ID;
  if (!id) {
    throw new Error('Missing NOTION_DATABASE_ID environment variable');
  }
  return id;
}

function getProjectsDatabaseId(): string {
  const id = process.env.NOTION_PROJECTS_DATABASE_ID;
  if (!id) {
    throw new Error('Missing NOTION_PROJECTS_DATABASE_ID environment variable');
  }
  return id;
}

// ---------------------------------------------------------------------------
// Helpers to extract Notion property values
// ---------------------------------------------------------------------------

function getTitle(page: PageObjectResponse): string {
  const prop = page.properties['title'] ?? page.properties['Title'] ?? page.properties['Name'] ?? page.properties['name'];
  if (prop?.type === 'title') {
    return prop.title.map((t) => t.plain_text).join('') || 'Untitled';
  }
  return 'Untitled';
}

function getText(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (prop?.type === 'rich_text') {
    return prop.rich_text.map((t) => t.plain_text).join('');
  }
  return '';
}

function getSelectOrText(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (prop?.type === 'select') {
    return prop.select?.name ?? '';
  }
  if (prop?.type === 'rich_text') {
    return prop.rich_text.map((t) => t.plain_text).join('');
  }
  return '';
}

function getCheckbox(page: PageObjectResponse, name: string): boolean {
  const prop = page.properties[name];
  if (prop?.type === 'checkbox') {
    return prop.checkbox;
  }
  return false;
}

function getCheckboxOrSelect(page: PageObjectResponse, name: string): boolean {
  const prop = page.properties[name];
  if (prop?.type === 'checkbox') {
    return prop.checkbox;
  }
  if (prop?.type === 'select') {
    const value = prop.select?.name?.toLowerCase();
    return value === 'true' || value === 'yes' || value === 'mobile';
  }
  return false;
}

function getDate(page: PageObjectResponse, name: string): string | null {
  const prop = page.properties[name];
  if (prop?.type === 'date' && prop.date?.start) {
    return prop.date.start;
  }
  return null;
}

function getNumber(page: PageObjectResponse, name: string): number | null {
  const prop = page.properties[name];
  if (prop?.type === 'number') {
    return prop.number;
  }
  return null;
}

function getUrl(page: PageObjectResponse, name: string): string | null {
  const prop = page.properties[name];
  if (prop?.type === 'url') {
    return prop.url;
  }
  return null;
}

function getMultiSelect(page: PageObjectResponse, name: string): string[] {
  const prop = page.properties[name];
  if (prop?.type === 'multi_select') {
    return prop.multi_select.map((s) => s.name);
  }
  return [];
}

function getCover(page: PageObjectResponse): string | null {
  // Prefer the built-in page cover
  if (page.cover) {
    if (page.cover.type === 'file') return page.cover.file.url;
    if (page.cover.type === 'external') return page.cover.external.url;
  }

  // Fallback to 'cover' property (Files & media column)
  const prop = page.properties['cover'];
  if (prop?.type === 'files' && prop.files.length > 0) {
    const file = prop.files[0];
    if (file.type === 'file') return file.file.url;
    if (file.type === 'external') return file.external.url;
  }

  return null;
}

function getFileUrl(page: PageObjectResponse, name: string): string | null {
  const prop = page.properties[name];
  if (prop?.type !== 'files' || prop.files.length === 0) return null;

  const file = prop.files[0];
  if (file.type === 'file') return file.file.url;
  if (file.type === 'external') return file.external.url;
  return null;
}

function getUrlOrFileUrl(page: PageObjectResponse, name: string): string | null {
  return getUrl(page, name) ?? getFileUrl(page, name);
}

function formatDisplayDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Map a Notion page to our index type
// ---------------------------------------------------------------------------

function pageToPostIndex(page: PageObjectResponse): NotionPostIndex {
  const date = getDate(page, 'date');
  return {
    id: page.id,
    slug: getText(page, 'slug') || page.id,
    title: getTitle(page),
    excerpt: getText(page, 'excerpt'),
    date,
    displayDate: formatDisplayDate(date),
    readTime: '3 min', // will be overridden when content is available
    tags: getMultiSelect(page, 'tags'),
    cover: getCover(page),
  };
}

function pageToProject(page: PageObjectResponse): NotionProject {
  return {
    id: page.id,
    slug: getText(page, 'slug') || page.id,
    title: getTitle(page),
    category: getSelectOrText(page, 'category'),
    description: getText(page, 'description'),
    tags: getMultiSelect(page, 'tags'),
    image: getFileUrl(page, 'image') ?? getCover(page) ?? '',
    hoverImage: getFileUrl(page, 'hoverImage'),
    video: getUrlOrFileUrl(page, 'video'),
    isMobile: getCheckboxOrSelect(page, 'isMobile') || getCheckboxOrSelect(page, 'mobile'),
    order: getNumber(page, 'order'),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch all published posts from the Notion database.
 * Sorted by date descending.
 */
export async function fetchPublishedPosts(limit?: number): Promise<NotionPostIndex[]> {
  const notion = getNotionClient();
  const databaseId = getDatabaseId();

  const filter: QueryDataSourceParameters['filter'] = {
    property: 'published',
    checkbox: { equals: true },
  };

  const sorts: QueryDataSourceParameters['sorts'] = [
    { property: 'date', direction: 'descending' },
  ];

  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;
  const targetCount = typeof limit === 'number' && limit > 0 ? limit : null;

  // Paginate through all results
  do {
    const remaining = targetCount === null ? 100 : Math.max(1, Math.min(100, targetCount - results.length));
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      filter,
      sorts,
      start_cursor: cursor,
      page_size: remaining,
    });

    for (const page of response.results) {
      if (isFullPage(page)) {
        results.push(page);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor && (targetCount === null || results.length < targetCount));

  const mapped = results.map(pageToPostIndex);
  return targetCount === null ? mapped : mapped.slice(0, targetCount);
}

/**
 * Fetch all published projects from the dedicated Notion database.
 * Sorted by `order` ascending (nulls last), then title.
 */
export async function fetchPublishedProjects(limit?: number): Promise<NotionProject[]> {
  const notion = getNotionClient();
  const databaseId = getProjectsDatabaseId();

  const filter: QueryDataSourceParameters['filter'] = {
    property: 'published',
    checkbox: { equals: true },
  };

  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;
  const targetCount = typeof limit === 'number' && limit > 0 ? limit : null;

  do {
    const remaining = targetCount === null ? 100 : Math.max(1, Math.min(100, targetCount - results.length));
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      filter,
      start_cursor: cursor,
      page_size: remaining,
    });

    for (const page of response.results) {
      if (isFullPage(page)) {
        results.push(page);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor && (targetCount === null || results.length < targetCount));

  const mapped = results
    .map(pageToProject)
    .filter((project) => project.image)
    .sort((a, b) => {
      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title);
    });

  return targetCount === null ? mapped : mapped.slice(0, targetCount);
}

/**
 * Fetch a single page by slug.
 * If the slug matches a Notion page ID (i.e. no custom slug was set),
 * fetch the page directly by ID instead.
 * Returns null if not found or not published.
 */
export async function fetchPostPageBySlug(
  slug: string,
): Promise<PageObjectResponse | null> {
  const notion = getNotionClient();
  const databaseId = getDatabaseId();

  // First try matching the slug property
  const response = await notion.dataSources.query({
    data_source_id: databaseId,
    filter: {
      and: [
        { property: 'slug', rich_text: { equals: slug } },
        { property: 'published', checkbox: { equals: true } },
      ],
    },
    page_size: 1,
  });

  const page = response.results[0];
  if (page && isFullPage(page)) return page;

  // Fallback: slug might be a page ID (when no custom slug was set)
  try {
    const pageById = await notion.pages.retrieve({ page_id: slug });
    if (isFullPage(pageById) && getCheckbox(pageById, 'published')) {
      return pageById;
    }
  } catch {
    // Not a valid page ID, or page not found
  }

  return null;
}

/**
 * Fetch page blocks (for content conversion).
 */
export async function fetchPageBlocks(pageId: string) {
  const notion = getNotionClient();
  return notion.blocks.children.list({ block_id: pageId, page_size: 100 });
}

export { pageToPostIndex };

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

/**
 * Fetch all open (un-resolved) comments for a given page.
 * Returns them in chronological order (oldest first).
 */
export async function fetchPageComments(pageId: string): Promise<NotionComment[]> {
  const notion = getNotionClient();

  const comments: NotionComment[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.comments.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const comment of response.results) {
      if (!('rich_text' in comment)) continue; // skip partial objects

      const text = comment.rich_text.map((rt) => rt.plain_text).join('');
      if (!text.trim()) continue;

      // Resolve display name
      let displayName = 'Anonymous';
      if (comment.display_name) {
        if (comment.display_name.resolved_name) {
          displayName = comment.display_name.resolved_name;
        } else if (comment.display_name.type === 'integration') {
          displayName = 'Bot';
        }
      }

      comments.push({
        id: comment.id,
        text,
        createdTime: comment.created_time,
        displayName,
      });
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return comments;
}

/**
 * Create a new page-level comment on a Notion page.
 * Uses a custom display name so comments appear as the visitor's chosen name.
 * Falls back to creating without display_name if the API rejects it.
 */
export async function createPageComment(
  pageId: string,
  text: string,
  displayName?: string,
): Promise<NotionComment> {
  const notion = getNotionClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = {
    parent: { page_id: pageId },
    rich_text: [
      {
        text: { content: text },
      },
    ],
  };

  // Add custom display name if provided
  if (displayName?.trim()) {
    body.display_name = {
      type: 'custom',
      custom: { name: displayName.trim() },
    };
  }

  let response;
  try {
    response = await notion.comments.create(body);
  } catch (err) {
    // If display_name caused the error, retry without it
    if (displayName?.trim()) {
      const bodyWithoutName = { ...body };
      delete bodyWithoutName.display_name;
      response = await notion.comments.create(bodyWithoutName);
    } else {
      throw err;
    }
  }

  // Handle partial response (when integration lacks read-comment capability)
  if (!('rich_text' in response)) {
    return {
      id: response.id,
      text,
      createdTime: new Date().toISOString(),
      displayName: displayName?.trim() || 'Anonymous',
    };
  }

  let resolvedName = 'Anonymous';
  if (response.display_name?.resolved_name) {
    resolvedName = response.display_name.resolved_name;
  } else if (displayName?.trim()) {
    resolvedName = displayName.trim();
  }

  return {
    id: response.id,
    text: response.rich_text.map((rt) => rt.plain_text).join(''),
    createdTime: response.created_time,
    displayName: resolvedName,
  };
}
