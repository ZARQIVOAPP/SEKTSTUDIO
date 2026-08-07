'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useCamera } from '@/lib/camera';
import { getNodeById } from '@/lib/canvas-config';
import { useMediaQuery } from '@/lib/use-media-query';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { navigateToNode } = useCamera();
  const isMobile = useMediaQuery('(max-width: 767px)');
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
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: isMobile ? 0.3 : 0.4,
          filter: 'contrast(1.15) brightness(0.8) saturation(0.85)',
        }}
      >
        <source src="/video/hero-bg.mov" />
      </video>

      {/* Film Grain Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Cinematic Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 20%, rgba(10,10,10,0.85) 100%)',
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

      {/* STUDIOS */}
      <motion.span
        className="font-display font-light uppercase leading-none tracking-tight block relative"
        style={{
          fontSize: 'clamp(3rem, 12vw, 14rem)',
          opacity: 0.95,
          color: 'var(--color-text-primary)',
          x: studioX,
          y: studioY,
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.95, y: 0 }}
        transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        STUDIOS
      </motion.span>

      {/* Enter CTA — Responsive (Bold White Glass on Mobile & Desktop) */}
      <motion.button
        className="absolute bottom-[15%] font-mono font-bold uppercase cursor-pointer"
        style={{
          fontSize: isMobile ? '12px' : '16px',
          fontWeight: isMobile ? 700 : 800,
          color: '#FFFFFF',
          padding: isMobile ? '14px 32px' : '18px 52px',
          letterSpacing: isMobile ? '0.4em' : '0.5em',
          border: isMobile ? '1.5px solid #FFFFFF' : '2.5px solid #FFFFFF',
          borderRadius: '50px',
          backgroundColor: isMobile ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: isMobile ? '0 0 20px rgba(0, 0, 0, 0.8)' : '0 0 35px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 255, 255, 0.25)',
          pointerEvents: 'auto',
          transition: 'all 0.3s ease',
          zIndex: 10,
        }}
        onClick={handleEnter}
        data-cursor="pointer"
        whileHover={{
          scale: isMobile ? 1.04 : 1.08,
          borderColor: '#FFFFFF',
          color: '#0A0A0A',
          backgroundColor: '#FFFFFF',
          boxShadow: isMobile ? '0 0 25px rgba(255, 255, 255, 0.4)' : '0 0 45px rgba(255, 255, 255, 0.6)',
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Enter
      </motion.button>

      {/* Tagline — Responsive (High-contrast text on mobile & desktop) */}
      <motion.p
        className="absolute bottom-[8%] font-mono font-semibold uppercase"
        style={{
          fontSize: isMobile ? 'var(--text-micro)' : 'clamp(0.7rem, 1vw, 0.85rem)',
          fontWeight: isMobile ? 600 : 700,
          letterSpacing: isMobile ? '0.2em' : '0.25em',
          color: '#FFFFFF',
          textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 0 15px rgba(0,0,0,0.85)',
          backgroundColor: isMobile ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.4)',
          padding: isMobile ? '4px 12px' : '6px 16px',
          borderRadius: '4px',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
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
