"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import type { NotionPostIndex } from '@/lib/notionTypes';
import { ChevronRight } from 'lucide-react';

export const Notes = () => {
  const { t } = useLanguage();
  const [featuredPosts, setFeaturedPosts] = useState<NotionPostIndex[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/posts?limit=3');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: NotionPostIndex[] = await res.json();
        if (!cancelled) {
          setFeaturedPosts(data.slice(0, 3));
        }
      } catch {
        // API failed — show empty state
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="notes" className="py-32 px-6 md:px-24 bg-(--color-surface-dim)">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">{t.notes.title}</h2>
          <Link 
            href="/notes"
            className="text-sm font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
          >
            {t.notes.viewAll}
          </Link>
        </div>
        <div className="space-y-12">
          {featuredPosts.map((note, i) => (
            <motion.div 
              key={note.id} 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1 }} 
            >
              <Link
                href={`/notes/${note.slug}`}
                className="group border-b border-(--color-border-medium) pb-12 hover:border-(--color-border-hover) transition-colors cursor-pointer block"
              >
                <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)] gap-x-10 gap-y-4 items-start">
                  <div className="md:pt-2">
                    <span className="block text-xs font-mono opacity-40 uppercase tracking-wider whitespace-nowrap">
                      {note.displayDate}
                    </span>
                    <span className="block text-xs font-mono opacity-30 uppercase tracking-wider mt-1">
                      {note.readTime}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-start gap-4">
                      <h3 className="flex-1 min-w-0 text-3xl md:text-[2.7rem] font-bold leading-[1.08] tracking-tight md:group-hover:translate-x-2 transition-transform duration-500">
                        {note.title}
                      </h3>
                      <ChevronRight size={22} className="hidden md:block mt-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="opacity-60 leading-relaxed mt-5 max-w-[68ch]">
                      {note.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
