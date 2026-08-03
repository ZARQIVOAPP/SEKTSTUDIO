'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface HeroProps {
  loaded?: boolean;
}

export function Hero({ loaded = true }: HeroProps) {
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // SEKT moves slowly
  const sektX = useTransform(mouseX, [-1, 1], [-15, 15]);
  const sektY = useTransform(mouseY, [-1, 1], [-10, 10]);

  // STUDIO moves faster and opposite for depth
  const studioX = useTransform(mouseX, [-1, 1], [30, -30]);
  const studioY = useTransform(mouseY, [-1, 1], [20, -20]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col justify-center select-none"
      style={{
        height: '100dvh',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%)',
        }}
      />

      {/* Main Typography */}
      <motion.div
        className="relative z-10 w-full flex flex-col items-start"
        style={{ padding: '0 var(--grid-margin)' }}
        variants={containerVariants}
        initial="hidden"
        animate={loaded ? 'visible' : 'hidden'}
      >
        {/* SEKT */}
        <div className="overflow-hidden w-full">
          <motion.div variants={itemVariants} style={{ x: sektX, y: sektY }}>
            <h1
              className="font-display font-bold leading-none tracking-tighter"
              style={{
                fontSize: 'clamp(5rem, 18vw, 20rem)',
                letterSpacing: '-0.05em',
                color: 'var(--color-text-primary)',
              }}
            >
              SEKT
            </h1>
          </motion.div>
        </div>

        {/* STUDIO */}
        <div className="overflow-hidden w-full flex justify-end">
          <motion.div variants={itemVariants} style={{ x: studioX, y: studioY }}>
            <span
              className="font-display font-bold leading-none tracking-tighter block"
              style={{
                fontSize: 'clamp(3rem, 12vw, 14rem)',
                letterSpacing: '-0.04em',
                color: 'var(--color-text-primary)',
                opacity: 0.9,
              }}
            >
              STUDIO
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Left — Tagline */}
      <motion.div
        className="absolute bottom-8 left-0 z-20"
        style={{ paddingLeft: 'var(--grid-margin)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className="font-mono uppercase tracking-widest leading-relaxed"
          style={{
            fontSize: 'var(--text-micro)',
            color: 'var(--color-text-secondary)',
            maxWidth: '200px',
          }}
        >
          Multidisciplinary<br />Creative Collective
        </p>
      </motion.div>

      {/* Bottom Right — Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 right-0 z-20 flex flex-col items-center gap-4"
        style={{ paddingRight: 'var(--grid-margin)' }}
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span
          className="font-mono uppercase tracking-widest"
          style={{
            fontSize: 'var(--text-micro)',
            color: 'var(--color-text-secondary)',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
        <div className="relative overflow-hidden" style={{ width: '1px', height: '64px' }}>
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'var(--color-text-muted)', opacity: 0.3 }}
          />
          <motion.div
            className="absolute top-0 left-0 w-full origin-top"
            style={{ backgroundColor: 'var(--color-text-primary)' }}
            initial={{ scaleY: 0, height: '100%' }}
            animate={{ scaleY: [0, 1, 1, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.4, 0.6, 1],
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
