"use client";

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import VariableProximity from '@/components/VariableProximity';
import { ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  const proximityContainerRef = useRef<HTMLDivElement>(null);

  return (
    <footer ref={containerRef} id="contact" className="py-48 px-6 md:px-24 text-center bg-[var(--color-surface)] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-xs uppercase tracking-[0.5em] mb-16 opacity-30 font-medium">{t.footer.getInTouch}</p>
        <a 
          href="mailto:hello@raycaster.dev" 
          className="relative inline-block text-5xl md:text-[10vw] group"
        >
          <div className="relative z-10 inline-block leading-relaxed">
            <div ref={proximityContainerRef} className="inline-block">
            <VariableProximity
              label={t.footer.talk}
              fromFontVariationSettings="'wght' 600, 'wdth' 100"
              toFontVariationSettings="'wght' 900, 'wdth' 150"
              containerRef={proximityContainerRef}
              radius={300}
              falloff="exponential"
              className="inline-block"
            />
            </div>
          </div>
        </a>
      </motion.div>
      
      <div className="mt-48 pt-12 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono opacity-30 tracking-widest uppercase">
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
