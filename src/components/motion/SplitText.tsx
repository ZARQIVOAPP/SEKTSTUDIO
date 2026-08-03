'use client';

import React from 'react';
import { motion } from 'motion/react';

export function SplitText({
  text,
  className = '',
  delay = 0,
  charDelay = 0.03,
  animation = 'fadeUp'
}: {
  text: string;
  className?: string;
  delay?: number;
  charDelay?: number;
  animation?: 'fadeUp' | 'fadeIn';
}) {
  const chars = text.split('');
  
  const variants = {
    hidden: {
      opacity: 0,
      y: animation === 'fadeUp' ? '100%' : 0
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: delay + i * charDelay,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const
      }
    })
  };
  
  return (
    <span className={`inline-block ${className}`}>
      {chars.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden relative">
          <motion.span
            custom={i}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
