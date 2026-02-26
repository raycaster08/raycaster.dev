"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import type { NotionProject } from '@/lib/notionTypes';
import { X, Play, Pause } from 'lucide-react';

export const VideoModal: React.FC<{ project: NotionProject; onClose: () => void }> = ({ project, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isExperimentalProject = project.category.trim().toLowerCase() === 'experiment';

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-6xl aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <video 
          ref={videoRef}
          src={project.video ?? ''} 
          autoPlay 
          className="w-full h-full object-contain"
          onEnded={() => setIsPlaying(false)}
        />
        
        <div className="absolute inset-0 flex flex-col justify-between p-8 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 via-transparent to-black/40">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{project.title}</h2>
              <span
                className={`mt-2 inline-flex rounded-md px-2 py-1 text-[10px] font-mono uppercase tracking-widest border ${
                  isExperimentalProject
                    ? 'border-amber-300/30 bg-amber-300/10 text-amber-200'
                    : 'border-white/20 bg-white/10 text-white/75'
                }`}
              >
                {isExperimentalProject ? 'Experiment' : 'Product'}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex justify-center items-center gap-8">
            <button 
              onClick={togglePlay}
              className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
          </div>

          <div className="flex justify-between items-center text-white/40 text-[10px] font-mono uppercase tracking-widest">
            <span>Full Preview</span>
            <div className="flex gap-4">
              {project.tags.join(" • ")}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
