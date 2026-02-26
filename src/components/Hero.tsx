"use client";

import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowUpRight } from 'lucide-react';

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-24 pt-20">
      <div className="max-w-5xl">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-xs md:text-base uppercase tracking-[0.3em] mb-8 opacity-60">{t.hero.role}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="text-5xl sm:text-7xl md:text-9xl font-bold leading-[0.9] tracking-tighter mb-12">
          {t.hero.title.split(t.hero.italic).map((part, i, arr) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && <span className="opacity-20 italic">{t.hero.italic}</span>}
            </React.Fragment>
          ))}
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">
          <p className="max-w-md text-base md:text-lg opacity-70 leading-relaxed">{t.hero.desc}</p>
          <a href="#work" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-current pb-1">{t.hero.viewWork} <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></a>
        </motion.div>
      </div>
    </section>
  );
};
