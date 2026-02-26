"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { Notes } from '@/components/Notes';
import { Experience } from '@/components/Experience';
import { About } from '@/components/About';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Notes />
        <Experience />
        <About />
        <Footer />
      </main>
    </>
  );
}
