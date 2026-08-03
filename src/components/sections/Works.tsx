'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ScrollReveal } from '../motion/ScrollReveal';

const FILTERS = ['All', 'Film', 'Design', 'Art Direction', 'Music'];

const PROJECTS = [
  { id: 1, title: 'Meridian', category: 'Film', year: '2024', description: 'A visual meditation on urban isolation and architectural silence.', image: '/images/work-meridian.jpg' },
  { id: 2, title: 'Void Protocol', category: 'Design', year: '2024', description: 'Brand identity system for an experimental audio collective.', image: '/images/work-void-protocol.jpg' },
  { id: 3, title: 'Phantom Thread', category: 'Art Direction', year: '2023', description: 'Editorial direction for a luxury fashion archive.', image: '/images/work-phantom-thread.jpg' },
  { id: 4, title: 'Resonance', category: 'Music', year: '2024', description: 'Album artwork and visual identity for ambient producer.', image: '/images/work-resonance.jpg' },
  { id: 5, title: 'Monolith', category: 'Design', year: '2023', description: 'Spatial identity for a brutalist concept gallery.', image: '/images/work-monolith.jpg' },
  { id: 6, title: 'Nocturne', category: 'Film', year: '2024', description: 'Short film exploring the liminal spaces between memory and place.', image: '/images/work-nocturne.jpg' },
];

export function Works() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects = PROJECTS.filter((project) => 
    activeFilter === 'All' ? true : project.category === activeFilter
  );

  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-12 lg:px-24" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-20 gap-8">
          <ScrollReveal>
            <span className="font-mono text-xs uppercase tracking-widest text-secondary">
              002 — SELECTED WORKS
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-6">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${
                    activeFilter === filter ? 'text-primary' : 'text-secondary hover:text-primary'
                  }`}
                >
                  {filter}
                  {activeFilter === filter && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-red-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-24">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              // Asymmetric layout logic
              // Even index: spans cols 1-7
              // Odd index: spans cols 8-12
              const isEven = index % 2 === 0;
              const colClasses = isEven 
                ? "md:col-span-7" 
                : "md:col-span-5 md:col-start-8 mt-0 md:mt-32";
              
              // Alternating aspect ratios
              const aspectClass = index % 3 === 0 ? "aspect-video" : "aspect-[4/3]";

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                  className={`group relative flex flex-col gap-4 ${colClasses}`}
                >
                  {/* Image Container */}
                  <div className={`w-full overflow-hidden relative border border-transparent group-hover:border-white/10 transition-colors duration-500 ${aspectClass}`}>
                    <motion.div 
                      className="w-full h-full absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover grayscale contrast-[1.1] transition-all duration-500 group-hover:grayscale-0 group-hover:contrast-100"
                      />
                    </motion.div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-sm rounded-full">
                        View Project
                      </span>
                    </div>
                  </div>

                  {/* Meta Data */}
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-xl md:text-2xl font-medium tracking-tight">
                        {project.title}
                      </h3>
                      <span className="font-mono text-xs text-secondary">
                        {project.id.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs text-secondary">
                      <span>{project.category}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span>{project.year}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
