"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t.nav.work, id: 'work' },
    { name: t.nav.notes, id: 'notes' },
    { name: t.nav.experience, id: 'experience' },
    { name: t.nav.about, id: 'about' },
    { name: t.nav.contact, id: 'contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-4 md:px-6 pt-4 md:pt-5 transition-all duration-500 ${
          isOpen ? 'opacity-0 pointer-events-none' : ''
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative mx-auto flex w-full max-w-[1440px] items-center justify-between rounded-[20px] md:rounded-[24px] px-4 md:px-6 py-3 md:py-4 text-(--color-fg) transition-all duration-500 ${
            isScrolled
              ? 'bg-(--color-glass) backdrop-blur-xl backdrop-saturate-125 shadow-[0_10px_28px_var(--color-shadow)]'
              : 'bg-(--color-glass-dim) backdrop-blur-lg backdrop-saturate-110 shadow-[0_6px_20px_var(--color-shadow-dim)]'
          }`}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[20px] md:rounded-[24px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-(--color-glass-gradient-from) via-(--color-glass-gradient-via) to-(--color-glass-gradient-to)" />
            <div className="absolute inset-[1px] rounded-[19px] md:rounded-[23px] bg-gradient-to-b from-(--color-glass-inner) to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative text-sm md:text-xl font-bold tracking-tighter"
          >
            RAYCASTER.DEV
          </motion.div>

          <div className="relative hidden md:flex items-center gap-6">
            <div className="relative flex gap-6 rounded-2xl px-5 py-2.5 text-xs lg:text-sm font-medium uppercase tracking-[0.2em]">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="opacity-75 hover:opacity-100 transition-opacity"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-bold tracking-widest uppercase">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'en'
                    ? 'opacity-100'
                    : 'opacity-45 hover:opacity-100'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('zh')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'zh'
                    ? 'opacity-100'
                    : 'opacity-45 hover:opacity-100'
                }`}
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

          <div className="relative flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-glass-btn) shadow-[inset_0_1px_0_var(--color-glass-btn-shadow)] backdrop-blur-md"
              aria-label="Toggle dark mode"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-glass-btn) shadow-[inset_0_1px_0_var(--color-glass-btn-shadow)] backdrop-blur-md"
              onClick={() => setIsOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </motion.div>
      </nav>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 w-full h-screen bg-(--color-bg) text-(--color-fg) p-8 flex flex-col justify-center items-center gap-12 md:hidden z-[60]"
          >
            <button className="absolute top-8 right-6" onClick={() => setIsOpen(false)}><X size={32} /></button>
            <div className="flex flex-col items-center gap-8">
              {navItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setIsOpen(false)} className="text-4xl font-bold tracking-tighter">{item.name}</a>
              ))}
            </div>
            <div className="flex gap-8 pt-12 border-t border-(--color-border-medium) w-full justify-center">
              <button onClick={() => { setLanguage('en'); setIsOpen(false); }} className={`text-sm font-bold tracking-widest ${language === 'en' ? 'opacity-100' : 'opacity-40'}`}>ENGLISH</button>
              <button onClick={() => { setLanguage('zh'); setIsOpen(false); }} className={`text-sm font-bold tracking-widest ${language === 'zh' ? 'opacity-100' : 'opacity-40'}`}>中文</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
