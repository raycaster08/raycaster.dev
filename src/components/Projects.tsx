"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import type { NotionProject } from '@/lib/notionTypes';
import { ProjectCard } from '@/components/ProjectCard';
import { VideoModal } from '@/components/VideoModal';

export const Projects = () => {
  const [activeVideoProject, setActiveVideoProject] = useState<NotionProject | null>(null);
  const [projects, setProjects] = useState<NotionProject[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/projects?limit=10');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: NotionProject[] = await res.json();
        if (cancelled) return;
        setProjects(data);
      } catch {
        // Notion API failed — show empty state
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="work" className="py-32 px-6 md:px-24">
      <div className="flex justify-between items-end mb-16">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">{t.projects.title}</h2>
        <span className="text-sm font-mono opacity-40">
          {projects.length > 0 ? `01 / ${String(projects.length).padStart(2, '0')}` : '00 / 00'}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onPlayClick={setActiveVideoProject} 
          />
        ))}
      </div>

      <AnimatePresence>
        {activeVideoProject && (
          <VideoModal 
            project={activeVideoProject} 
            onClose={() => setActiveVideoProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};
