'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

interface LoaderProps {
  onComplete: () => void;
}

// Target position: nav logo at top-left (matches Navigation component)
const NAV_LOGO_TOP = 20; // px from top
const NAV_LOGO_LEFT = 24; // px from left
const NAV_LOGO_HEIGHT = 32; // px height in nav

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'travel' | 'done'>('loading');

  // Faster organic progress simulation
  useEffect(() => {
    if (phase !== 'loading') return;

    let current = 0;
    const tick = () => {
      const remaining = 100 - current;
      // Faster increments for shorter load time
      const increment = Math.random() * Math.min(remaining * 0.25, 12) + 1.5;
      current = Math.min(current + increment, 100);
      setProgress(Math.floor(current));

      if (current >= 100) {
        // Short pause then begin travel
        setTimeout(() => setPhase('travel'), 200);
        return;
      }

      // Faster ticks
      const delay = 25 + Math.random() * 50;
      setTimeout(tick, delay);
    };

    setTimeout(tick, 200);
  }, [phase]);

  // Travel → Done sequence
  useEffect(() => {
    if (phase === 'travel') {
      // Wait for the logo travel animation to finish, then signal done
      const timer = setTimeout(() => setPhase('done'), 1200);
      return () => clearTimeout(timer);
    }
    if (phase === 'done') {
      onComplete();
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' ? (
        <>
          {/* Background overlay — fades out during travel */}
          <motion.div
            className="fixed inset-0 z-[200]"
            style={{ backgroundColor: '#0A0A0A' }}
            animate={
              phase === 'travel'
                ? { opacity: 0 }
                : { opacity: 1 }
            }
            transition={
              phase === 'travel'
                ? { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
                : { duration: 0.3 }
            }
          >
            {/* Radial glow behind logo */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(255,0,0,0.04) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                phase === 'travel'
                  ? { opacity: 0, scale: 0.3 }
                  : { opacity: [0, 0.5, 0.3], scale: [0.5, 1.2, 1] }
              }
              transition={{
                duration: phase === 'travel' ? 0.5 : 3,
                repeat: phase === 'travel' ? 0 : Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* SEKT STUDIO text — fades out on travel */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center"
              style={{ marginTop: '160px' }}
              initial={{ opacity: 0, y: 15 }}
              animate={
                phase === 'travel'
                  ? { opacity: 0, y: -10 }
                  : { opacity: 1, y: 0 }
              }
              transition={{
                duration: 0.5,
                delay: phase === 'travel' ? 0 : 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span
                className="font-display font-medium tracking-[0.3em] uppercase"
                style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', letterSpacing: '0.35em' }}
              >
                SEKT STUDIO
              </span>
            </motion.div>

            {/* Progress Counter — fades out on travel */}
            <motion.div
              className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-6"
              style={{ padding: '0 var(--grid-margin)' }}
              initial={{ opacity: 0 }}
              animate={phase === 'travel' ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3, delay: phase === 'travel' ? 0 : 0.3 }}
            >
              <div
                className="flex-1 max-w-[200px]"
                style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <motion.div
                  className="h-full origin-left"
                  style={{ backgroundColor: 'var(--color-text-primary)' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress / 100 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </div>
              <span
                className="font-mono tabular-nums"
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  minWidth: '3ch',
                  textAlign: 'right',
                }}
              >
                {String(progress).padStart(2, '0')}
              </span>
            </motion.div>

            {/* Corner decorations */}
            <motion.div
              className="absolute top-8 left-8 font-mono uppercase tracking-widest"
              style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}
              initial={{ opacity: 0 }}
              animate={phase === 'travel' ? { opacity: 0 } : { opacity: 1 }}
              transition={{ delay: phase === 'travel' ? 0 : 0.5, duration: 0.3 }}
            >
              Est. 2024
            </motion.div>
            <motion.div
              className="absolute top-8 right-8 font-mono uppercase tracking-widest"
              style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}
              initial={{ opacity: 0 }}
              animate={phase === 'travel' ? { opacity: 0 } : { opacity: 1 }}
              transition={{ delay: phase === 'travel' ? 0 : 0.6, duration: 0.3 }}
            >
              Worldwide
            </motion.div>
          </motion.div>

          {/* ─── THE TRAVELING LOGO ─── */}
          {/* This sits ABOVE everything at z-[201] and animates from center to nav position */}
          <motion.div
            className="fixed z-[201] pointer-events-none"
            initial={{
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              width: 120,
              height: 250,
            }}
            animate={
              phase === 'travel'
                ? {
                    top: NAV_LOGO_TOP,
                    left: NAV_LOGO_LEFT,
                    x: 0,
                    y: 0,
                    width: NAV_LOGO_HEIGHT * 0.47, // maintain aspect ratio (479/1011 ≈ 0.47)
                    height: NAV_LOGO_HEIGHT,
                  }
                : {
                    top: '50%',
                    left: '50%',
                    x: '-50%',
                    y: '-50%',
                    width: 120,
                    height: 250,
                  }
            }
            transition={
              phase === 'travel'
                ? {
                    duration: 1.0,
                    ease: [0.87, 0, 0.13, 1], // expo in-out for dramatic travel
                  }
                : {
                    duration: 0,
                  }
            }
          >
            {/* Clip reveal during loading phase */}
            <motion.div
              className="relative w-full h-full overflow-hidden"
              initial={{ clipPath: 'inset(0 50% 0 50%)' }}
              animate={{ clipPath: 'inset(0 0% 0 0%)' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.87, 0, 0.13, 1] }}
            >
              <Image
                src="/images/sekt-logo.png"
                alt="SEKT STUDIO"
                fill
                sizes="120px"
                className="object-contain"
                style={{ filter: 'invert(1)' }}
                priority
              />
            </motion.div>

            {/* Scanning Line — only during loading */}
            {phase === 'loading' && (
              <motion.div
                className="absolute left-0 right-0"
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                }}
                initial={{ top: '0%', opacity: 0 }}
                animate={{
                  top: ['0%', '100%', '0%'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
