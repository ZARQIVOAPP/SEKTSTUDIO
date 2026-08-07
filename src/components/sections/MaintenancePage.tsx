'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

export function MaintenancePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {/* Grain texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
        }}
      />

      {/* Radial glow */}
      <motion.div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,0,0,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Background logo — 3D extruded vertical spin */}
      <motion.div
        style={{
          position: 'absolute',
          width: '280px',
          height: '580px',
          pointerEvents: 'none',
          perspective: '1200px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateY: [0, 360] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Main face — visible from both sides for smooth full rotation */}
          <Image
            src="/images/sekt-logo.png"
            alt=""
            fill
            className="object-contain"
            style={{ filter: 'invert(1)' }}
            priority
          />

          {/* Extrusion layers — create depth/thickness */}
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`extrude-${i}`}
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateZ(${-(i + 1) * 2}px)`,
                opacity: 1 - i * 0.08,
              }}
            >
              <Image
                src="/images/sekt-logo.png"
                alt=""
                fill
                className="object-contain"
                style={{ filter: 'invert(1) brightness(0.6)' }}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ─── Main Content ─── */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>

        {/* Small logo at top */}
        <motion.div
          style={{ width: '28px', height: '60px', margin: '0 auto 40px', position: 'relative' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/images/sekt-logo.png"
            alt="SEKT STUDIOS"
            fill
            className="object-contain"
            style={{ filter: 'invert(1)' }}
            priority
          />
        </motion.div>

        {/* Section index */}
        <motion.div
          className="font-mono"
          style={{
            fontSize: '10px',
            letterSpacing: '0.4em',
            color: '#444',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Status — 001
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="font-display"
          style={{
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
            fontWeight: 700,
            color: '#F5F5F0',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Coming Soon
        </motion.h1>

        {/* Accent line */}
        <motion.div
          style={{
            width: '50px',
            height: '2px',
            backgroundColor: '#FF0000',
            margin: '0 auto 28px',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.87, 0, 0.13, 1] }}
        />

        {/* Subtitle */}
        <motion.p
          className="font-mono"
          style={{
            fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
            color: '#666',
            lineHeight: 1.8,
            maxWidth: '420px',
            margin: '0 auto 50px',
            letterSpacing: '0.05em',
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          We&apos;re crafting something extraordinary.<br />
          Our digital experience is currently under construction.
        </motion.p>

        {/* Animated progress dots */}
        <motion.div
          style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '60px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#FF0000',
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* ─── Bottom info ─── */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span
          className="font-mono"
          style={{ fontSize: '9px', color: '#333', letterSpacing: '0.15em', textTransform: 'uppercase' }}
        >
          Est. 2024
        </span>
        <span
          className="font-mono"
          style={{ fontSize: '9px', color: '#333', letterSpacing: '0.15em', textTransform: 'uppercase' }}
        >
          Worldwide
        </span>
      </motion.div>

      {/* Thin top border line animation */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,0,0,0.3), transparent)',
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Scanning line effect */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
          pointerEvents: 'none',
        }}
        animate={{
          top: ['0%', '100%', '0%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
