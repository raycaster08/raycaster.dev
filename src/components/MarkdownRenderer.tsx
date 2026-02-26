import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

// Custom light theme that adapts to CSS variables
const lightTheme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: '#1a1a2e',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    fontSize: '0.875em',
    lineHeight: '1.7',
  },
  'pre[class*="language-"]': {
    color: '#1a1a2e',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    fontSize: '0.875em',
    lineHeight: '1.7',
    padding: '1.5em',
    margin: '0',
    overflow: 'auto',
    background: 'var(--color-surface-dim)',
    borderRadius: '0.75rem',
  },
  comment: { color: '#6a737d' },
  prolog: { color: '#6a737d' },
  doctype: { color: '#6a737d' },
  cdata: { color: '#6a737d' },
  punctuation: { color: '#555' },
  property: { color: '#005cc5' },
  tag: { color: '#22863a' },
  boolean: { color: '#005cc5' },
  number: { color: '#005cc5' },
  constant: { color: '#005cc5' },
  symbol: { color: '#005cc5' },
  deleted: { color: '#b31d28' },
  selector: { color: '#22863a' },
  'attr-name': { color: '#6f42c1' },
  string: { color: '#032f62' },
  char: { color: '#032f62' },
  builtin: { color: '#6f42c1' },
  inserted: { color: '#22863a' },
  operator: { color: '#d73a49' },
  entity: { color: '#005cc5' },
  url: { color: '#005cc5' },
  atrule: { color: '#d73a49' },
  'attr-value': { color: '#032f62' },
  keyword: { color: '#d73a49' },
  function: { color: '#6f42c1' },
  'class-name': { color: '#6f42c1' },
  regex: { color: '#032f62' },
  important: { color: '#d73a49', fontWeight: 'bold' },
  variable: { color: '#e36209' },
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Detect dark mode by checking the html class
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-12 mb-6">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-10 mb-5">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight mt-8 mb-4">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg md:text-xl font-semibold tracking-tight mt-6 mb-3">{children}</h4>
        ),

        // Paragraphs
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        p: ({ children, node, ...props }: any) => {
          // Block-level tags that our custom components may produce (figure, div, video, etc.)
          // react-markdown wraps these in <p> which is invalid HTML. Unwrap them.
          const blockTags = new Set(['img', 'video', 'figure', 'div', 'table', 'pre']);
          const hasBlockChild = node?.children?.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (child: any) => child.type === 'element' && blockTags.has(child.tagName),
          );
          if (hasBlockChild) {
            return <>{children}</>;
          }
          // Also check for links to video files — they become block-level <div>s
          const videoExtensions = /\.(mp4|webm|mov|ogg)(\?.*)?$/i;
          const hasVideoLink = node?.children?.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (child: any) =>
              child.type === 'element' &&
              child.tagName === 'a' &&
              child.properties?.href &&
              videoExtensions.test(child.properties.href),
          );
          if (hasVideoLink) {
            return <>{children}</>;
          }
          return <p className="text-sm md:text-base leading-8 opacity-80 font-light mb-6" {...props}>{children}</p>;
        },

        // Emphasis / Strong
        strong: ({ children }) => <strong className="font-semibold opacity-100">{children}</strong>,
        em: ({ children }) => <em className="italic opacity-60 text-sm">{children}</em>,

        // Links — detect video file URLs and render as <video>
        a: ({ href, children }) => {
          const videoExtensions = /\.(mp4|webm|mov|ogg)(\?.*)?$/i;
          if (href && videoExtensions.test(href)) {
            return (
              <div className="my-8 rounded-xl overflow-hidden border border-[var(--color-border)]">
                <video className="w-full" controls src={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                </video>
              </div>
            );
          }
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-fg)] transition-colors"
            >
              {children}
            </a>
          );
        },

        // Images
        img: ({ src, alt }) => {
          if (!src || typeof src !== 'string') return null;
          return (
            <figure className="my-8">
              <Image
                src={src}
                alt={alt ?? ''}
                width={1200}
                height={800}
                className="w-full rounded-xl border border-[var(--color-border)]"
                style={{ width: '100%', height: 'auto' }}
                sizes="100vw"
                unoptimized
              />
              {alt && (
                <figcaption className="text-xs text-center opacity-40 mt-3 font-mono">{alt}</figcaption>
              )}
            </figure>
          );
        },

        // Code blocks
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');

          if (match) {
            // Fenced code block with language
            return (
              <div className="my-6 rounded-xl overflow-hidden border border-[var(--color-border)]">
                <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-surface-dim)] border-b border-[var(--color-border)]">
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  className="markdown-code-syntax"
                  style={isDark ? oneDark : lightTheme}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    background: isDark ? '#1e1e1e' : 'var(--color-surface-dim)',
                    fontSize: '0.8125rem',
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }

          // Inline code
          return (
            <code
              className="px-1.5 py-0.5 rounded-md bg-[var(--color-surface-dim)] border border-[var(--color-border)] text-[0.85em] font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },

        // Pre — just pass through, code block handles styling
        pre: ({ children }) => <>{children}</>,

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-outside pl-6 mb-6 space-y-2 text-sm md:text-base leading-8 opacity-80 font-light">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside pl-6 mb-6 space-y-2 text-sm md:text-base leading-8 opacity-80 font-light">{children}</ol>
        ),
        li: ({ children }) => <li className="pl-1">{children}</li>,

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="my-6 pl-6 border-l-2 border-[var(--color-border-strong)] opacity-80 italic">
            {children}
          </blockquote>
        ),

        // Tables
        table: ({ children }) => (
          <div className="my-6 overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-[var(--color-surface-dim)] text-left">{children}</thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
          <tr className="border-b border-[var(--color-border)] last:border-0">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider opacity-60">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 opacity-80">{children}</td>
        ),

        // Horizontal rule
        hr: () => <hr className="my-10 border-[var(--color-border)]" />,

        // Video elements (passed through by rehype-raw)
        video: ({ ...props }) => (
          <div className="my-8 rounded-xl overflow-hidden border border-[var(--color-border)]">
            <video className="w-full" controls {...props} />
          </div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

MarkdownRenderer.displayName = 'MarkdownRenderer';
