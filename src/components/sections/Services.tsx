'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal } from '../motion/ScrollReveal';

const SERVICES = [
  { number: '01', title: 'Creative Direction', description: 'Defining the vision. Setting the trajectory. Every project begins with a singular creative thesis that guides every subsequent decision.' },
  { number: '02', title: 'Brand Identity', description: 'Not logos. Systems. We engineer comprehensive identity architectures that function across every touchpoint and scale.' },
  { number: '03', title: 'Film Production', description: 'From concept to color grade. Cinematic storytelling that transcends the screen and embeds itself in memory.' },
  { number: '04', title: 'Motion Design', description: 'Movement with meaning. Every frame choreographed, every transition intentional, every sequence engineered.' },
  { number: '05', title: 'Experiential Design', description: 'Physical and digital spaces that immerse, disorient, and transform. Architecture for the senses.' },
  { number: '06', title: 'Digital Experiences', description: 'Interfaces as art. Websites, applications, and platforms that reject convention and reward exploration.' },
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
