'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-87.5%']);

  return (
    <section ref={containerRef} className="relative h-[300vh]" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-12 left-6 md:left-12 lg:left-24 z-10">
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

        <motion.div style={{ x }} className="flex h-full items-center pl-6 md:pl-12 lg:pl-24">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex h-[60vh] w-[80vw] md:w-[60vw] lg:w-[45vw] shrink-0 flex-col justify-between pr-12 md:pr-24 pl-12 relative group"
              style={{ borderLeft: '1px solid var(--color-border)' }}
            >
              <div
                className="absolute top-0 left-0 w-full h-px origin-left scale-x-0 transition-transform duration-1000 group-hover:scale-x-100"
                style={{ backgroundColor: 'var(--color-border)' }}
              />
              <div className="overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20%' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <span
                    className="font-mono font-bold leading-none block"
                    style={{
                      fontSize: 'clamp(4rem, 8vw, 8rem)',
                      color: 'var(--color-border)',
                      opacity: 0.3,
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    {step.number}
                  </span>
                  <h3
                    className="font-display font-medium"
                    style={{
                      fontSize: 'var(--text-display-sm)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-sm)',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 'var(--text-body)',
                      color: 'var(--color-text-secondary)',
                      maxWidth: '28rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Progress Bar */}
        <div className="absolute bottom-12 left-0 w-full px-6 md:px-12 lg:px-24">
          <div className="h-px w-full" style={{ backgroundColor: 'var(--color-border)' }}>
            <motion.div
              className="h-full origin-left"
              style={{
                scaleX: scrollYProgress,
                backgroundColor: 'var(--color-text-primary)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
