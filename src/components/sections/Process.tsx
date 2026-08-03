'use client';

import { motion } from 'motion/react';

const steps = [
  { number: '01', title: 'Discover', description: 'We listen before we create. Understanding the landscape, the audience, and the unspoken tension that makes a project necessary.' },
  { number: '02', title: 'Research', description: 'Deep immersion into context, reference, and precedent. We study what exists to understand what does not yet exist.' },
  { number: '03', title: 'Strategy', description: 'The invisible architecture. Defining the creative thesis, the constraints, and the opportunities that will shape every decision.' },
  { number: '04', title: 'Direction', description: 'Setting the creative coordinates. Art direction, tone, palette, typography, and the emotional frequency of the project.' },
  { number: '05', title: 'Design', description: 'Craft without compromise. Every pixel considered, every proportion deliberate, every detail earning its place.' },
  { number: '06', title: 'Production', description: 'Where vision meets execution. Film, motion, code, sound — brought to life with technical precision.' },
  { number: '07', title: 'Delivery', description: 'Not a handoff — a launch. We ensure every artifact performs flawlessly in its intended environment.' },
  { number: '08', title: 'Evolution', description: 'Projects are living systems. We monitor, refine, and evolve our work as context changes.' },
];

export function Process() {
  return (
    <section
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Section Label */}
      <div className="absolute top-8 left-8 z-10">
        <span
          className="font-mono uppercase tracking-widest"
          style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-secondary)',
          }}
        >
          004 — OUR PROCESS
        </span>
      </div>

      {/* Horizontal storyboard strip */}
      <div className="flex items-center h-full pt-16 overflow-x-auto px-8">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex-shrink-0 flex flex-col justify-center gap-4 px-10 relative"
            style={{
              width: '320px',
              height: '80%',
              borderLeft: '1px solid var(--color-border)',
            }}
          >
            <span
              className="font-mono font-bold leading-none block"
              style={{
                fontSize: '3.5rem',
                color: 'var(--color-border)',
                opacity: 0.4,
              }}
            >
              {step.number}
            </span>
            <h3
              className="font-display font-medium"
              style={{
                fontSize: '1.5rem',
                color: 'var(--color-text-primary)',
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                maxWidth: '260px',
              }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
