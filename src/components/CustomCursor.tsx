"use client";

import React, { useState, useEffect } from 'react';
import { motion, useSpring, AnimatePresence, useMotionValue } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/i18n/translations';

export const CustomCursor = () => {
  const { language } = useLanguage();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, .interactive');
      setIsHovering(!!interactive);
      
      if (target.closest('.project-card')) {
        setHoverText(translations[language].projects.view);
      } else {
        setHoverText("");
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, language]);

  const springConfig = { damping: 25, stiffness: 200 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  if (isMobile) return null;

  return (
    <>
      <motion.div 
        className="custom-cursor-ring" 
        style={{ 
          x: ringX, 
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 2 : isClicked ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 250,
          mass: 0.5
        }}
      >
        <AnimatePresence>
          {hoverText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute text-[8px] font-bold tracking-widest text-white"
            >
              {hoverText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div 
        className="custom-cursor-dot" 
        style={{ 
          x: mouseX, 
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 1.5 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 250,
          mass: 0.5
        }}
      />
    </>
  );
};
