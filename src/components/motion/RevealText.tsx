'use client';

import { motion } from 'motion/react';

interface RevealTextProps {
  text?: string;
  children?: string;
  className?: string;
  delay?: number;
}

export function RevealText({
  text,
  children,
  className = '',
  delay = 0,
}: RevealTextProps) {
  const content = text || children || '';
  const words = content.split(' ');
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <p className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-flex overflow-hidden relative" style={{ marginRight: '0.25em' }}>
          <motion.span
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.025,
              ease,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </p>
  );
}
