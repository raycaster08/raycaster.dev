"use client";

import React, { useEffect, use } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft } from 'lucide-react';

export default function LegalPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const { t } = useLanguage();
  const legalType = type === 'terms' ? 'terms' : 'privacy';
  const content = legalType === 'privacy' ? t.privacyPage : t.termsPage;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-fg)">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference text-white">
        <Link 
          href="/"
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {t.notePage.back}
        </Link>
        <div className="text-xl font-bold tracking-tighter">RAYCASTER.DEV</div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-40 pb-32">
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-mono opacity-40 uppercase tracking-widest mb-8"
          >
            {content.lastUpdated}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold leading-[1.1] tracking-tighter mb-12"
          >
            {content.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl leading-relaxed opacity-60 font-light"
          >
            {content.intro}
          </motion.p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="space-y-16"
        >
          {content.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-2xl font-bold tracking-tight mb-6">{section.title}</h2>
              <p className="text-lg leading-relaxed opacity-70 font-light">
                {section.content}
              </p>
            </section>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-(--color-border) text-center">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono opacity-30 uppercase tracking-widest">
          <p>© 2024 RAYCASTER.DEV</p>
          <div className="flex gap-8">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t.footer.backToTop}</button>
            <Link href="/">{t.notePage.exit}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
