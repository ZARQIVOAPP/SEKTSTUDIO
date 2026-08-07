'use client';

import { RevealText } from '../motion/RevealText';
import { ScrollReveal } from '../motion/ScrollReveal';

export function About() {
  return (
    <section className="w-full py-32 md:py-48 px-6 md:px-12 lg:px-24 relative" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Label */}
        <ScrollReveal>
          <div className="mb-24">
            <span className="font-mono text-xs uppercase tracking-widest text-secondary">
              001 — ABOUT
            </span>
          </div>
        </ScrollReveal>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 mb-36">
          
          {/* Left Column (Main Statement) */}
          <div className="md:col-span-6 lg:col-span-6">
            <RevealText 
              text="SEKT STUDIOS is an independent creative studio building ideas across culture, design, film, and digital experiences."
              className="text-2xl md:text-3xl lg:text-4xl font-display font-medium leading-snug tracking-tight text-primary"
            />
          </div>

          {/* Right Column (Body Text) */}
          <div className="md:col-span-6 lg:col-span-5 lg:col-start-8 flex flex-col justify-end">
            <RevealText 
              text="We believe thoughtful work has the power to move people, shape culture, and leave a lasting impression engineered to transcend the medium it inhabits."
              className="text-base md:text-lg font-mono text-secondary leading-relaxed"
            />
          </div>

        </div>

        {/* Pull Quote / Archival Tagline */}
        <ScrollReveal className="w-full relative py-20 border-t border-white/10 flex items-center justify-center">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-display font-light italic tracking-tight text-center text-primary leading-tight px-4 max-w-[90vw]">
            "An evolving archive of stories,<br />
            <span className="text-secondary ml-4 md:ml-12">objects, and collaborations."</span>
          </h2>
        </ScrollReveal>

      </div>
    </section>
  );
}
