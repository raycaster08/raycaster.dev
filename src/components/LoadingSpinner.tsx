"use client";

import React from 'react';
import { motion } from 'motion/react';

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-(--color-bg)/80 backdrop-blur-sm">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-(--color-border) border-t-(--color-fg) rounded-full"
      />
    </div>
  );
};
