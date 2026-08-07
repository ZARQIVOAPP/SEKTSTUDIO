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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 mb-48">
          
          {/* Left Column (Statement) */}
          <div className="md:col-span-6 lg:col-span-5">
            <RevealText 
              text="We are not an agency. We are a collective operating at the intersection of sound, space, and pixel."
              className="text-2xl md:text-3xl lg:text-4xl font-display font-medium leading-tight tracking-tight"
            />
          </div>

          {/* Right Column (Body Text) */}
          <div className="md:col-span-6 lg:col-span-5 lg:col-start-8 flex flex-col justify-end">
            <RevealText 
              text="SEKT STUDIOS is a multidisciplinary creative engine. We build worlds, not campaigns. We engineer culture, not content. Every project is an artifact — designed to endure, crafted to provoke, built to transcend the medium it inhabits."
              className="text-base md:text-lg text-secondary leading-relaxed"
            />
          </div>

        </div>

        {/* Pull Quote Section */}
        <ScrollReveal className="w-full relative py-24 border-t border-white/10 flex items-center justify-center">
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-display font-light italic tracking-tight text-center text-primary leading-none px-4 max-w-[90vw]">
            "We do not follow trends.<br />
            <span className="text-secondary ml-8 md:ml-16">We set coordinates."</span>
          </h2>
        </ScrollReveal>

      </div>
    </section>
  );
}
