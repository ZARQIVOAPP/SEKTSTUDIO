'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal } from '../motion/ScrollReveal';

const SERVICES = [
  {
    number: '01',
    title: 'Creative Direction',
    description: 'Setting the thesis and visual vision. We shape cohesive concepts that define tone, aesthetic, and cultural trajectory from inception to execution.',
  },
  {
    number: '02',
    title: 'Brand Identity',
    description: 'Comprehensive identity systems engineered for longevity. From typographic frameworks to visual languages that command attention across every medium.',
  },
  {
    number: '03',
    title: 'Filmmaking',
    description: 'Cinematic storytelling with intentional atmosphere. Concept, direction, and production crafted to move audiences and endure in memory.',
  },
  {
    number: '04',
    title: 'Photography',
    description: 'High-contrast editorial, commercial, and spatial imagery. Capturing raw mood, form, and texture with precision and narrative weight.',
  },
  {
    number: '05',
    title: 'Color Grading',
    description: 'Distinct visual tone and chromatic depth. Sculpting light and palette to elevate film, digital media, and imagery into art.',
  },
  {
    number: '06',
    title: 'Web Design & Development',
    description: 'Custom, immersive digital environments. Bespoke web architecture, fluid animations, and interactive canvases built to disrupt conventional web standards.',
  },
  {
    number: '07',
    title: 'Graphic Design',
    description: 'Obsessive typographic, spatial, and editorial layouts. Visual communication that cuts through noise with clarity and aesthetic power.',
  },
  {
    number: '08',
    title: 'Music Production',
    description: 'Sonic architectures, atmospheric sound design, and custom scoring. Crafting auditory landscapes engineered for film, spaces, and digital worlds.',
  },
  {
    number: '09',
    title: 'Songwriting & Ghostwriting',
    description: 'Conceptual lyricism and vocal arrangement. Crafting authentic, resonant narratives and melodies tailored to high-tier creative visions.',
  },
  {
    number: '10',
    title: 'Merchandise & Product Design',
    description: 'Physical artifacts and tactile brand extensions. Limited garments, physical objects, and packaging built with archival quality.',
  },
];

export function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleService = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-12 lg:px-24" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header */}
        <ScrollReveal>
          <div className="mb-16 md:mb-24">
            <span className="font-mono text-xs uppercase tracking-widest text-secondary">
              003 — CAPABILITIES
            </span>
          </div>
        </ScrollReveal>

        {/* Services List */}
        <div className="w-full flex flex-col">
          {SERVICES.map((service, index) => {
            const isOpen = openIndex === index;
            const isLast = index === SERVICES.length - 1;

            return (
              <ScrollReveal key={service.number} delay={index * 0.05}>
                <div 
                  className={`group relative w-full flex flex-col border-t border-white/10 transition-colors duration-300 hover:bg-white/[0.02] cursor-pointer ${
                    isLast ? 'border-b' : ''
                  }`}
                  onClick={() => toggleService(index)}
                >
                  {/* Top Row (Always visible) */}
                  <div className="w-full py-8 md:py-12 flex items-center justify-between px-4 md:px-8">
                    <span className={`font-mono text-xs md:text-sm transition-colors duration-300 w-12 md:w-24 ${
                      isOpen ? 'text-red-600' : 'text-secondary group-hover:text-primary'
                    }`}>
                      {service.number}
                    </span>
                    
                    <h3 className="flex-1 font-display text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight text-center md:text-left transition-transform duration-300 group-hover:translate-x-2">
                      {service.title}
                    </h3>
                    
                    <div className="w-12 md:w-24 flex justify-end">
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="text-secondary group-hover:text-primary"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* Expandable Description */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-12 md:pb-16 px-4 md:px-8 md:pl-[120px] lg:pl-[160px] max-w-4xl">
                          <p className="text-lg md:text-xl text-secondary leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
