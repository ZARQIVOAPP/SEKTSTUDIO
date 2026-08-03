'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { ScrollReveal } from '../motion/ScrollReveal';

const team = [
  { name: 'Aria Chen', role: 'Creative Director', image: '/images/portrait-aria.jpg', disciplines: ['Direction', 'Strategy', 'Film'] },
  { name: 'Marcus Webb', role: 'Design Lead', image: '/images/portrait-marcus.jpg', disciplines: ['Identity', 'Typography', 'Systems'] },
  { name: 'Yuki Tanaka', role: 'Motion Director', image: '/images/portrait-yuki.jpg', disciplines: ['Animation', 'Film', '3D'] },
  { name: 'Sofia Reyes', role: 'Producer', image: '/images/portrait-sofia.jpg', disciplines: ['Production', 'Operations', 'Culture'] },
  { name: 'James Okafor', role: 'Technical Director', image: '/images/portrait-james.jpg', disciplines: ['Engineering', 'Interactive', 'Sound'] },
  { name: 'Luna Park', role: 'Art Director', image: '/images/portrait-luna.jpg', disciplines: ['Photography', 'Spatial', 'Editorial'] },
];

export function Collective() {
  return (
    <section
      id="collective"
      style={{
        paddingTop: 'var(--space-section)',
        paddingBottom: 'var(--space-section)',
        paddingLeft: 'var(--grid-margin)',
        paddingRight: 'var(--grid-margin)',
      }}
    >
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <ScrollReveal>
          <span
            className="font-mono uppercase tracking-widest block"
            style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            005 — THE COLLECTIVE
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p
            className="font-display leading-snug"
            style={{
              fontSize: 'var(--text-display-sm)',
              color: 'var(--color-text-primary)',
              maxWidth: '48rem',
            }}
          >
            A constellation of directors, designers, engineers, and artists. United by obsession with craft.
          </p>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
        {team.map((member, index) => (
          <ScrollReveal key={member.name} delay={index * 0.08}>
            <div className="group relative cursor-pointer">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: '3/4',
                  marginBottom: 'var(--space-md)',
                  backgroundColor: 'var(--color-bg-secondary)',
                }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] grayscale contrast-[1.1] group-hover:grayscale-0 group-hover:contrast-100"
                />

                {/* Hover Overlay */}
                <motion.div
                  className="absolute inset-0 flex flex-col justify-between p-8"
                  style={{ backgroundColor: 'rgba(10,10,10,0.85)' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ul
                    className="font-mono flex flex-col gap-2"
                    style={{
                      fontSize: 'var(--text-caption)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {member.disciplines.map((discipline) => (
                      <li key={discipline}>— {discipline}</li>
                    ))}
                  </ul>

                  <div className="flex gap-4">
                    {['IG', 'X', 'Li'].map((icon) => (
                      <div
                        key={icon}
                        className="w-10 h-10 rounded-full flex items-center justify-center font-mono transition-colors duration-300 hover:bg-white hover:text-black"
                        style={{
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--text-micro)',
                        }}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Name & Role */}
              <h4
                className="font-display font-medium"
                style={{
                  fontSize: 'var(--text-heading)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.25rem',
                }}
              >
                {member.name}
              </h4>
              <p
                className="font-mono"
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {member.role}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
