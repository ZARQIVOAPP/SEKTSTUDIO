'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useTheme } from '@/lib/theme';

const links = ['Home', 'Works', 'About', 'Services', 'Journal', 'Contact'];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-[100] mix-blend-difference text-white pointer-events-none"
        style={{ padding: '20px 24px' }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="relative pointer-events-auto cursor-pointer"
            style={{ width: 15, height: 32 }}
          >
            <Image
              src="/images/sekt-logo.png"
              alt="SEKT STUDIO"
              fill
              sizes="15px"
              className="object-contain"
              style={{ filter: 'invert(1)' }}
            />
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4 pointer-events-auto">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center justify-center w-10 h-10 z-[101]"
              data-cursor="pointer"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.svg
                    key="sun"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="moon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>

            {/* Hamburger */}
            <button
              className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-[101]"
              onClick={() => setIsOpen(!isOpen)}
              data-cursor="pointer"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="w-8 h-[2px] bg-white block origin-center transition-all"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="w-8 h-[2px] bg-white block origin-center transition-all"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[90] flex items-center"
            style={{
              backgroundColor: isDark ? 'rgba(10,10,10,0.98)' : 'rgba(245,245,240,0.98)',
              padding: 'var(--grid-margin)',
            }}
          >
            <div className="w-full flex justify-between items-end h-full pt-24 pb-12">
              <div className="flex flex-col gap-2">
                {links.map((link, i) => (
                  <div key={link} className="overflow-hidden">
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{
                        delay: 0.1 + i * 0.05,
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="font-display font-bold uppercase tracking-tighter cursor-pointer transition-colors duration-300"
                      style={{
                        fontSize: 'clamp(3rem, 10vw, 8rem)',
                        color: 'var(--color-text-primary)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = 'var(--color-text-secondary)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = 'var(--color-text-primary)')
                      }
                    >
                      {link}
                    </motion.div>
                  </div>
                ))}
              </div>

              <div
                className="hidden md:flex flex-col gap-8 font-mono uppercase pb-8"
                style={{ fontSize: 'var(--text-micro)' }}
              >
                <div>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    Location
                  </p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Worldwide</p>
                </div>
                <div>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Email</p>
                  <p
                    className="cursor-pointer transition-colors duration-300"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = 'var(--color-text-primary)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'var(--color-text-secondary)')
                    }
                  >
                    hello@sektstudio.com
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
