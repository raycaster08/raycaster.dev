"use client";

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import { ScrollProgress } from '@/components/ScrollProgress';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SmoothScrollProvider>
          {children}
          <ScrollProgress />
        </SmoothScrollProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
