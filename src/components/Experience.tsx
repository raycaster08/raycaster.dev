"use client";

import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';

export const Experience = () => {
  const { t } = useLanguage();
  return (
    <section id="experience" className="py-32 px-6 md:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div><h2 className="text-4xl md:text-6xl font-bold tracking-tighter md:sticky md:top-32">{t.experience.title.split('.').map((part, i) => <React.Fragment key={i}>{part}{i === 0 && <br className="hidden md:block" />}</React.Fragment>)}</h2></div>
        <div className="space-y-16 md:space-y-24">
          {t.experience.items.map((exp, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative pl-8 border-l border-[var(--color-border-medium)]">
              <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-[var(--color-fg)] rounded-full" />
              <span className="text-sm font-mono opacity-40 mb-2 block">{exp.period}</span>
              <h3 className="text-xl md:text-2xl font-bold mb-1">{exp.role}</h3>
              <p className="text-base md:text-lg opacity-60 mb-6">{exp.company}</p>
              <p className="text-sm md:text-base opacity-70 leading-relaxed">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
