"use client";

import { useEffect, useRef, useState } from 'react';

export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const displayedProgressRef = useRef(0);
  const renderedProgressRef = useRef(0);
  const lastRawProgressRef = useRef(0);

  useEffect(() => {
    const getRawProgress = () => {
      const root = document.documentElement;
      const body = document.body;
      const viewportHeight = window.innerHeight || root.clientHeight;
      const scrollTop = window.scrollY || root.scrollTop || body.scrollTop || 0;
      const documentHeight = Math.max(root.scrollHeight, body.scrollHeight);
      const scrollableHeight = Math.max(documentHeight - viewportHeight, 0);
      const ratio = scrollableHeight <= 0 ? 0 : scrollTop / scrollableHeight;
      return Math.min(Math.max(ratio, 0), 1);
    };

    const showAndScheduleHide = () => {
      setIsVisible(true);
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, 700);
    };

    const animate = () => {
      const rawProgress = getRawProgress();

      if (Math.abs(rawProgress - lastRawProgressRef.current) > 0.0005) {
        showAndScheduleHide();
      }

      lastRawProgressRef.current = rawProgress;

      const current = displayedProgressRef.current;
      const next = current + (rawProgress - current) * 0.18;
      const snapped = Math.abs(rawProgress - next) < 0.0001 ? rawProgress : next;

      displayedProgressRef.current = snapped;

      if (Math.abs(snapped - renderedProgressRef.current) > 0.001) {
        renderedProgressRef.current = snapped;
        setProgress(snapped);
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    const initial = getRawProgress();
    displayedProgressRef.current = initial;
    renderedProgressRef.current = initial;
    lastRawProgressRef.current = initial;

    const handleResize = () => {
      lastRawProgressRef.current = getRawProgress();
    };

    window.addEventListener('resize', handleResize);
    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed right-3 top-1/2 z-50 -translate-y-1/2 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      <div className="relative h-48 w-1.5 overflow-hidden rounded-full bg-(--color-border-medium)">
        <div
          className="absolute inset-0 origin-top rounded-full bg-(--color-fg)"
          style={{ transform: `scaleY(${progress})` }}
        />
      </div>
    </div>
  );
};
