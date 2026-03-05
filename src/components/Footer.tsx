"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowUpRight } from 'lucide-react';

const HoverSlideText = ({ text, className = '' }: { text: string; className?: string }) => {
  const [hovered, setHovered] = useState(false);
  const letters = text.split('');

  return (
    <motion.span
      className={`inline-flex flex-wrap justify-center ${className}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {letters.map((letter, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden relative"
          style={{ lineHeight: '1.1em', height: '1.1em' }}
        >
          <motion.span
            className="inline-block"
            animate={{ y: hovered ? '-100%' : '0%' }}
            transition={{
              duration: 0.35,
              ease: [0.76, 0, 0.24, 1],
              delay: i * 0.02,
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
          <motion.span
            className="inline-block absolute left-0 top-full"
            animate={{ y: hovered ? '-100%' : '0%' }}
            transition={{
              duration: 0.35,
              ease: [0.76, 0, 0.24, 1],
              delay: i * 0.02,
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="pt-48 pb-24 px-6 md:px-24 text-center bg-(--color-surface) overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-xs uppercase tracking-[0.5em] mb-16 opacity-30 font-medium">{t.footer.getInTouch}</p>
        <a
          href="mailto:raycaster.dev@gmail.com"
          className="relative inline-block group"
        >
          <HoverSlideText
            text={t.footer.talk}
            className="text-5xl md:text-[10vw] font-black"
          />
        </a>
      </motion.div>
      
      <div className="mt-48 pt-12 border-t border-(--color-border) flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono opacity-30 tracking-widest uppercase">
        <p>{t.footer.rights}</p>
        <div className="flex gap-12">
          <Link href="/legal/privacy" className="hover:opacity-100 transition-opacity">{t.footer.privacy}</Link>
          <Link href="/legal/terms" className="hover:opacity-100 transition-opacity">{t.footer.terms}</Link>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="hover:opacity-100 transition-opacity flex items-center gap-2"
          >
            {t.footer.backToTop}
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
};
