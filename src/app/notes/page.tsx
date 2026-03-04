"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { NotionPostIndex } from '@/lib/notionTypes';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Clock, 
  Calendar,
  Sun,
  Moon,
} from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export default function NotesPage() {
  const { t, language, setLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<NotionPostIndex[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: NotionPostIndex[] = await res.json();
        if (!cancelled) {
          setArticles(data);
        }
      } catch {
        // API failed — show empty state
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);

  const currentArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return articles.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, articles]);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-(--color-bg) pt-32 pb-20 px-6 md:px-24">
      {/* Minimal nav bar for articles page */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 pt-4 md:pt-5">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between rounded-[20px] md:rounded-[24px] px-4 md:px-6 py-3 md:py-4 bg-(--color-glass) backdrop-blur-xl backdrop-saturate-125 shadow-[0_10px_28px_var(--color-shadow)] text-(--color-fg)">
          <Link 
            href="/"
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            {t.notes.backHome}
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

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-4">{t.notes.articlesTitle}</h1>
          <p className="text-base md:text-lg opacity-50 max-w-xl">{t.notes.articlesDesc}</p>
        </div>

        {/* Article List */}
        <div className="space-y-16 mb-20">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-16"
            >
              {currentArticles.map((article) => (
                <Link 
                  key={article.id}
                  href={`/notes/${article.slug}`}
                  className="group cursor-pointer grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 items-start block"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-(--color-surface-dim)">
                    {article.cover && (
                      <Image
                        src={article.cover}
                        alt={article.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        style={{ width: '100%', height: '100%' }}
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono uppercase tracking-widest opacity-40">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {article.displayDate || article.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                    </div>
                    <h2 className="text-3xl font-bold group-hover:translate-x-2 transition-transform duration-500 tracking-tight">
                      {article.title}
                    </h2>
                    <p className="opacity-60 leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="pt-2">
                      <span className="text-xs font-bold uppercase tracking-widest border-b border-(--color-border-strong) pb-1 group-hover:border-(--color-fg) transition-colors">{t.notes.readArticle}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-(--color-border)">
          <div className="text-xs font-mono opacity-40 uppercase tracking-widest">
            {t.notes.pageInfo
              .replace('{current}', currentPage.toString())
              .replace('{total}', totalPages.toString())
              .replace('{count}', articles.length.toString())}
          </div>
          
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-(--color-border) hover:bg-(--color-fg) hover:text-(--color-bg) disabled:opacity-10 disabled:hover:bg-transparent disabled:hover:text-current transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1 mx-2">
              {pageNumbers.map((page, i) => (
                <React.Fragment key={i}>
                  {page === "..." ? (
                    <span className="w-10 h-10 flex items-center justify-center text-xs opacity-20">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                        currentPage === page 
                          ? "bg-(--color-fg) text-(--color-bg) pointer-events-none" 
                          : "hover:bg-(--color-muted) opacity-40 hover:opacity-100"
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-(--color-border) hover:bg-(--color-fg) hover:text-(--color-bg) disabled:opacity-10 disabled:hover:bg-transparent disabled:hover:text-current transition-all"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
