'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const socialLinks = [
  { label: 'Instagram', href: '#' },
  { label: 'Twitter/X', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Vimeo', href: '#' },
  { label: 'Behance', href: '#' },
];

export function Footer() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0.85, 1], [0.96, 1.02]);
  const skewX = useTransform(scrollYProgress, [0.9, 0.95, 1], [0, 1.5, 0]);
  const [konamiTriggered, setKonamiTriggered] = useState(false);

  const triggerKonami = useCallback(() => {
    setKonamiTriggered(true);
    document.body.style.filter = 'invert(1)';
    document.body.style.transition = 'filter 0.15s ease';

    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 200);

    setTimeout(() => {
      setKonamiTriggered(false);
    }, 2500);
  }, []);

  useEffect(() => {
    let keyIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const expected = KONAMI_CODE[keyIndex];
      if (e.key === expected || e.key.toLowerCase() === expected.toLowerCase()) {
        keyIndex++;
        if (keyIndex === KONAMI_CODE.length) {
          triggerKonami();
          keyIndex = 0;
        }
      } else {
        keyIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerKonami]);

  return (
    <footer
      className="relative min-h-[80vh] flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Social Links */}
      <div className="flex flex-wrap gap-8 px-6 md:px-12 lg:px-24 pt-24">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-mono text-xs uppercase tracking-widest transition-colors duration-300"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            aria-label={`Visit SEKT STUDIOS on ${link.label}`}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Massive Outlined Logo */}
      <div className="flex-grow flex items-center justify-center px-6 my-24">
        <motion.div style={{ scale, skewX }} className="w-full text-center select-none">
          <span
            className="font-display font-bold leading-none block"
            style={{
              fontSize: 'clamp(4rem, 15vw, 16rem)',
              color: 'transparent',
              WebkitTextStroke: '1px var(--color-text-muted)',
              letterSpacing: '-0.03em',
            }}
          >
            SEKT STUDIOS
          </span>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div
        className="flex justify-between items-center px-6 md:px-12 lg:px-24 pb-8 font-mono uppercase tracking-widest"
        style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)' }}
      >
        <span>© 2024 SEKT STUDIOS</span>
        <span>Designed & Engineered by SEKT</span>
      </div>

      {/* Konami Code Easter Egg */}
      {konamiTriggered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-full font-bold shadow-2xl"
            style={{
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-bg-primary)',
            }}
          >
            You found it. ◉
          </motion.div>
        </div>
      )}
    </footer>
  );
}
