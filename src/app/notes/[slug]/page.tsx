"use client";

import React, { useState, useEffect, useCallback, useRef, use } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { NotionPostDetail } from '@/lib/notionTypes';
import type { NotionComment } from '@/lib/notionTypes';
import { 
  ArrowLeft, 
  Clock, 
  MessageSquare, 
  Send,
  User,
  Sun,
  Moon,
} from 'lucide-react';

function formatCommentTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}

interface CommentFormProps {
  pageId: string;
  onCommentCreated: (comment: NotionComment) => void;
  placeholder: string;
  postingAs: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ pageId, onCommentCreated, placeholder, postingAs }) => {
  const [newComment, setNewComment] = useState('');
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const trimmedName = nickname.trim();
      const displayName = trimmedName || 'Anonymous';
      const body = { text: newComment.trim(), displayName };
      const res = await fetch(`/api/comments/${encodeURIComponent(pageId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const created: NotionComment = await res.json();
      onCommentCreated(created);
      setNewComment('');
      setNickname('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmitComment} className="mb-20">
      <div className="relative group">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Anonymous"
          className="w-full bg-(--color-surface) border border-(--color-border) rounded-xl px-6 py-3 text-sm placeholder:text-lg placeholder:text-(--color-fg) placeholder:opacity-40 outline-none focus:border-(--color-border-strong) transition-colors mb-4"
        />
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-(--color-surface) border border-(--color-border) rounded-2xl p-6 min-h-[120px] text-lg placeholder:text-(--color-fg) placeholder:opacity-40 outline-none focus:border-(--color-border-strong) focus:shadow-xl focus:shadow-(--color-shadow-dim) transition-colors resize-none"
        />
        <button
          disabled={isSubmitting || !newComment.trim()}
          className="absolute bottom-4 right-4 p-3 bg-(--color-fg) text-(--color-bg) rounded-full disabled:opacity-20 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-opacity"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ scale: [1, 0.9, 1], opacity: [1, 0.65, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <Send size={18} />
            </motion.div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
      {submitError && (
        <p className="text-xs text-red-500 mt-2">{submitError}</p>
      )}
      <p className="text-[10px] font-mono opacity-30 mt-3 uppercase tracking-widest text-right">
        {postingAs}
      </p>
    </form>
  );
};

export default function NoteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, language, setLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState<NotionPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<NotionComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  // Fetch article data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: NotionPostDetail = await res.json();
        if (!cancelled) setNote(data);
      } catch {
        // Failed to load
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!note) return;
    try {
      const res = await fetch(`/api/comments/${encodeURIComponent(note.id)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: NotionComment[] = await res.json();
      setComments(data);
    } catch {
      // Silently fail
    } finally {
      setIsLoadingComments(false);
    }
  }, [note]);

  useEffect(() => {
    if (note) fetchComments();
  }, [note, fetchComments]);

  const handleCommentCreated = useCallback((created: NotionComment) => {
    setComments((prev) => [...prev, created]);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (!note) return <div className="min-h-screen flex items-center justify-center">Article not found</div>;

  return (
    <div ref={containerRef} className="min-h-screen bg-(--color-bg) text-(--color-fg)">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 pt-4 md:pt-5">
        <div
          className="mx-auto flex w-full max-w-[1440px] items-center justify-between rounded-[20px] md:rounded-[24px] px-4 md:px-6 py-3 md:py-4 bg-(--color-glass) backdrop-blur-xl backdrop-saturate-125 shadow-[0_10px_28px_var(--color-shadow)] text-(--color-fg)"
        >
          <Link 
            href="/notes"
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            {t.notePage.back}
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-bold tracking-widest uppercase">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all ${language === 'en' ? 'opacity-100' : 'opacity-45 hover:opacity-100'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('zh')}
                className={`px-2 py-1 rounded-md transition-all ${language === 'zh' ? 'opacity-100' : 'opacity-45 hover:opacity-100'}`}
              >
                ZH
              </button>
              <button
                onClick={toggleTheme}
                className="ml-1 p-1.5 rounded-md opacity-60 hover:opacity-100 transition-all"
                aria-label="Toggle dark mode"
              >
                {resolvedTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cover Image */}
      {note.cover && (
        <div className="w-full pt-24">
          <Image
            src={note.cover}
            alt={note.title}
            width={1200}
            height={540}
            className="w-full h-[200px] md:h-[280px] object-cover"
          />
        </div>
      )}

      <main className={`max-w-3xl mx-auto px-6 pb-32 ${note.cover ? 'pt-12' : 'pt-40'}`}>
        {/* Article Header */}
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap items-center gap-4 md:gap-6 mb-8 text-[10px] md:text-xs font-mono opacity-40 uppercase tracking-widest"
          >
            <span>{note.displayDate ?? note.date}</span>
            <span className="flex items-center gap-1.5"><Clock size={12} /> {note.readTime}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold leading-[1.1] tracking-tighter mb-12"
          >
            {note.title}
          </motion.h1>
        </header>

        {/* Article Body */}
        <motion.article 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-none"
        >
          <MarkdownRenderer content={note.content} />
        </motion.article>

        {/* Comments Section */}
        <section className="mt-32 pt-20 border-t border-(--color-border)">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-bold tracking-tighter flex items-center gap-4">
              <MessageSquare size={28} className="opacity-60" />
              {t.notePage.feedback}
              {!isLoadingComments && (
                <span className="text-sm font-mono opacity-30 font-normal">{comments.length}</span>
              )}
            </h2>
          </div>

          <CommentForm
            pageId={note.id}
            onCommentCreated={handleCommentCreated}
            placeholder={t.notePage.placeholder}
            postingAs={t.notePage.postingAs}
          />

          <div className="space-y-12">
            {isLoadingComments ? (
              <div className="flex justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-(--color-border) border-t-(--color-fg) rounded-full"
                />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-sm opacity-30 font-mono uppercase tracking-widest py-12">
                {t.notePage.noComments}
              </p>
            ) : (
              <AnimatePresence initial={false}>
                {comments.map((comment) => (
                  <motion.div 
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-(--color-surface-dim) flex items-center justify-center opacity-60">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-bold tracking-tight">{comment.displayName || 'Anonymous'}</span>
                          <span className="text-[10px] font-mono opacity-30 uppercase">{formatCommentTime(comment.createdTime)}</span>
                        </div>
                        <p className="text-lg opacity-70 leading-relaxed max-w-2xl whitespace-pre-wrap">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-(--color-border) text-center">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono opacity-30 uppercase tracking-widest">
          <p>&copy; 2024 RAYCASTER.DEV</p>
          <div className="flex gap-8">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t.footer.backToTop}</button>
            <Link href="/notes">{t.notePage.exit}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
