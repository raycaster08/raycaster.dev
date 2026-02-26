"use client";

import React from 'react';
import { motion } from 'motion/react';

export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <motion.div animate={{ x: [0, 100, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-1/2 -left-1/4 w-full h-full bg-[var(--color-ambient-glow)] blur-[120px] rounded-full" />
    </div>
  );
};
