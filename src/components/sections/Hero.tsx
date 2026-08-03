'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useCamera } from '@/lib/camera';
import { getNodeById } from '@/lib/canvas-config';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { navigateToNode } = useCamera();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  // Parallax layers
  const sektX = useTransform(springX, [-1, 1], [-15, 15]);
  const sektY = useTransform(springY, [-1, 1], [-10, 10]);
  const studioX = useTransform(springX, [-1, 1], [30, -30]);
  const studioY = useTransform(springY, [-1, 1], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(nx);
    mouseY.set(ny);
  };

  const handleEnter = () => {
    const aboutNode = getNodeById('about');
    if (aboutNode) navigateToNode(aboutNode);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
      onMouseMove={handleMouseMove}
    >
      {/* Radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%)',
        }}
      />

      {/* SEKT */}
      <motion.h1
        className="font-display font-bold uppercase leading-none tracking-tighter relative"
        style={{
          fontSize: 'clamp(5rem, 18vw, 20rem)',
          letterSpacing: '-0.05em',
          color: 'var(--color-text-primary)',
          x: sektX,
          y: sektY,
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        SEKT
      </motion.h1>

      {/* STUDIO */}
      <motion.span
        className="font-display font-light uppercase leading-none tracking-tight block relative"
        style={{
          fontSize: 'clamp(3rem, 12vw, 14rem)',
          opacity: 0.9,
          color: 'var(--color-text-primary)',
          x: studioX,
          y: studioY,
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        STUDIO
      </motion.span>

      {/* Enter CTA */}
      <motion.button
        className="absolute bottom-[15%] font-mono uppercase tracking-[0.4em] cursor-pointer"
        style={{
          fontSize: '10px',
          color: 'var(--color-text-muted)',
          padding: '12px 28px',
          border: '1px solid var(--color-border)',
          borderRadius: '50px',
          backgroundColor: 'transparent',
          pointerEvents: 'auto',
          transition: 'border-color 0.4s ease, color 0.4s ease',
          zIndex: 10,
        }}
        onClick={handleEnter}
        data-cursor="pointer"
        whileHover={{
          borderColor: 'var(--color-text-secondary)',
          color: 'var(--color-text-primary)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Enter
      </motion.button>

      {/* Tagline */}
      <motion.p
        className="absolute bottom-[8%] font-mono uppercase tracking-widest"
        style={{
          fontSize: 'var(--text-micro)',
          color: 'var(--color-text-muted)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        Multidisciplinary Creative Collective
      </motion.p>
    </div>
  );
}
