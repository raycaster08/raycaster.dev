/**
 * Types for Notion-sourced posts.
 * Used across the API routes and UI components.
 */

/** Post summary for list views (home page, articles page). */
export interface NotionPostIndex {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string | null;
  displayDate: string | null;
  readTime: string;
  tags: string[];
  cover: string | null;
}

/** Full post with rendered markdown content. */
export interface NotionPostDetail extends NotionPostIndex {
  content: string; // markdown
}

/** Project item from Notion, normalized for the client. */
export interface NotionProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  hoverImage: string | null;
  video: string | null;
  isMobile: boolean;
  order: number | null;
}

/** Comment from Notion comments API, normalized for the client. */
export interface NotionComment {
  id: string;
  text: string;
  createdTime: string;
  displayName: string;
}
