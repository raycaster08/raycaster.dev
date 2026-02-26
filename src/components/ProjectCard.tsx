"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import type { NotionProject } from '@/lib/notionTypes';
import { ArrowUpRight, Play } from 'lucide-react';

const PHONE_SHOT_BACKGROUNDS: Record<string, string> = {
  griby:
    'radial-gradient(circle_at_20%_25%,rgba(211,168,83,0.18),transparent_42%),radial-gradient(circle_at_78%_72%,rgba(241,214,156,0.12),transparent_44%),linear-gradient(135deg,rgba(33,31,28,0.94),rgba(56,52,46,0.9))',
  mercury:
    'radial-gradient(circle_at_18%_30%,rgba(52,117,255,0.16),transparent_42%),radial-gradient(circle_at_80%_68%,rgba(0,217,255,0.1),transparent_44%),linear-gradient(135deg,rgba(12,20,35,0.96),rgba(18,28,46,0.92))',
};

const MotionImage = motion(Image);

export const ProjectCard: React.FC<{ project: NotionProject; onPlayClick: (project: NotionProject) => void }> = ({ project, onPlayClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isExperimentalProject = project.category.trim().toLowerCase() === 'experiment';
  const hasHoverImage = !!project.hoverImage && project.hoverImage !== project.image;
  const isPhoneShotProject = project.isMobile && !project.video;
  const isContainMediaProject = !isPhoneShotProject;
  const phoneShotBackground = PHONE_SHOT_BACKGROUNDS[project.slug] ?? 'linear-gradient(135deg,rgba(45,45,45,0.95),rgba(72,72,72,0.9))';

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.8 }} 
      className="group project-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-surface-dim)] mb-6 rounded-2xl">
        {isPhoneShotProject ? (
          <>
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0.85, scale: isHovered ? 1.02 : 1 }}
              transition={{ duration: 0.5 }}
              style={{
                backgroundImage: isHovered
                  ? phoneShotBackground
                  : 'linear-gradient(135deg,rgba(92,92,92,0.32),rgba(124,124,124,0.24))',
              }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_30%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_78%_68%,rgba(255,255,255,0.08),transparent_42%)]" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-black/20" />
            </motion.div>
            <MotionImage
              animate={{
                opacity: hasHoverImage && isHovered ? 0.08 : 0.1,
                scale: isHovered ? 1.2 : 1.14,
                filter: isHovered ? 'grayscale(0.2) saturate(0.95) contrast(0.8)' : 'grayscale(1) saturate(0.25) contrast(0.75)',
              }}
              transition={{ duration: 0.45 }}
              src={project.image}
              alt={project.title}
              fill
              sizes="100vw"
              className="absolute inset-0 w-full h-full object-cover blur-3xl"
              referrerPolicy="no-referrer"
            />
            {hasHoverImage && (
              <MotionImage
                animate={{
                  opacity: isHovered ? 0.12 : 0.02,
                  scale: isHovered ? 1.2 : 1.1,
                  filter: isHovered ? 'grayscale(0.2) saturate(0.95) contrast(0.8)' : 'grayscale(1) saturate(0.2) contrast(0.75)',
                }}
                transition={{ duration: 0.45 }}
                src={project.hoverImage ?? ''}
                alt={`${project.title} preview background`}
                fill
                sizes="100vw"
                className="absolute inset-0 w-full h-full object-cover blur-3xl"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/4 via-white/0 to-black/14" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_38%,transparent_68%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12),rgba(255,255,255,0)_18%,rgba(255,255,255,0)_82%,rgba(255,255,255,0.08))]" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-[13%] top-[14%] h-[72%] w-[1px] bg-white/6" />
              <div className="absolute right-[14%] bottom-[14%] h-[64%] w-[1px] bg-white/5" />
            </div>
            <div className="absolute inset-0 p-4 md:p-6">
              <motion.div
                animate={{
                  x: isHovered ? '3%' : '0%',
                  y: isHovered ? '-1%' : '0%',
                  rotate: isHovered ? -5 : -8,
                  scale: isHovered ? 0.96 : 0.92,
                  opacity: hasHoverImage ? 0.72 : 0.9,
                }}
                transition={{ duration: 0.45 }}
                className="absolute left-[12%] top-[13%] h-[78%] md:h-[80%] aspect-[9/19.5] rounded-[18px] overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
              >
                <MotionImage
                  src={project.hoverImage ?? project.image}
                  alt={`${project.title} secondary preview`}
                  animate={{ filter: isHovered ? 'grayscale(0) saturate(1)' : 'grayscale(1) saturate(0.2)' }}
                  transition={{ duration: 0.35 }}
                  fill
                  sizes="100vw"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-black/18" />
              </motion.div>

              <motion.div
                animate={{
                  x: isHovered ? '-2%' : '0%',
                  y: isHovered ? '-2%' : '0%',
                  rotate: isHovered ? 2 : 5,
                  scale: isHovered ? 1.03 : 1,
                }}
                transition={{ duration: 0.45 }}
                className="absolute right-[15%] top-[8%] h-[84%] md:h-[86%] aspect-[9/19.5] rounded-[20px] overflow-hidden border border-white/20 shadow-[0_28px_70px_rgba(0,0,0,0.34)]"
              >
                <MotionImage
                  src={project.image}
                  alt={project.title}
                  animate={{ filter: isHovered ? 'grayscale(0) saturate(1)' : 'grayscale(1) saturate(0.2)' }}
                  transition={{ duration: 0.35 }}
                  fill
                  sizes="100vw"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20" />
              </motion.div>

              <motion.div
                animate={{ opacity: isHovered ? 0.55 : 0.35, scale: isHovered ? 1.04 : 1 }}
                transition={{ duration: 0.45 }}
                className="absolute right-[10%] top-[18%] h-[50%] w-[20%] md:w-[16%] rounded-full bg-white/8 blur-2xl"
              />
            </div>
          </>
        ) : (
          <>
            {isContainMediaProject ? (
              <>
                <MotionImage
                  animate={{ opacity: 0.14, scale: isHovered ? 1.07 : 1.04 }}
                  transition={{ duration: 0.45 }}
                  src={project.image}
                  alt={`${project.title} backdrop`}
                  fill
                  sizes="100vw"
                  className="absolute inset-0 h-full w-full object-cover blur-2xl grayscale saturate-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/8 to-black/6" />
                <div className="absolute inset-0 p-3 md:p-4">
                  <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/30 bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                    <MotionImage
                      animate={{
                        opacity: isHovered ? 0 : 1,
                        filter: isHovered ? 'grayscale(0) saturate(1)' : 'grayscale(1) saturate(0.15)',
                      }}
                      transition={{ duration: 0.35 }}
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="100vw"
                      className="absolute inset-0 h-full w-full object-contain p-1.5 md:p-2"
                      referrerPolicy="no-referrer"
                    />

                    {project.video && (
                      <motion.video
                        ref={videoRef}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.35 }}
                        src={project.video}
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 h-full w-full object-contain p-1.5 md:p-2"
                      />
                    )}

                    {hasHoverImage && (
                      <MotionImage
                        animate={{
                          opacity: isHovered ? 1 : 0,
                          filter: isHovered ? 'grayscale(0) saturate(1)' : 'grayscale(1) saturate(0.15)',
                        }}
                        transition={{ duration: 0.35 }}
                        src={project.hoverImage ?? ''}
                        alt={`${project.title} preview`}
                        fill
                        sizes="100vw"
                        className="absolute inset-0 h-full w-full object-contain p-1.5 md:p-2"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <MotionImage 
                  animate={{ opacity: isHovered ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                  src={project.image} 
                  alt={project.title} 
                  fill
                  sizes="100vw"
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  referrerPolicy="no-referrer" 
                />
                
                {project.video && (
                  <motion.video
                    ref={videoRef}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    src={project.video}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {hasHoverImage && (
                  <MotionImage
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    src={project.hoverImage ?? ''}
                    alt={`${project.title} preview`}
                    fill
                    sizes="100vw"
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </>
            )}
          </>
        )}

        {project.video && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPlayClick(project);
            }}
            className="absolute bottom-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white/20 z-10"
          >
            <Play size={20} fill="currentColor" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold tracking-tight">{project.title}</h3>
          <ArrowUpRight size={20} className="opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="opacity-60 text-sm leading-relaxed max-w-md">{project.description}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <span
            className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-md border ${
              isExperimentalProject
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                : 'border-[var(--color-border-medium)] bg-[var(--color-muted)] text-[var(--color-fg)] opacity-80'
            }`}
          >
            {isExperimentalProject ? 'Experiment' : 'Product'}
          </span>
          {project.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 bg-[var(--color-muted)] rounded-md opacity-40">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
