"use client";

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export const About = () => {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-32 px-6 md:px-24 bg-(--color-about-bg) text-(--color-about-fg)">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="aspect-3/4 bg-(--color-about-img-bg) overflow-hidden">
          <Image
            src="https://picsum.photos/seed/profile/800/1200"
            alt="Profile"
            width={800}
            height={1200}
            className="w-full h-full object-cover opacity-80 grayscale"
            style={{ width: '100%', height: '100%' }}
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12">{t.about.title}</h2>
          <div className="space-y-6 text-xl opacity-70 leading-relaxed">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
