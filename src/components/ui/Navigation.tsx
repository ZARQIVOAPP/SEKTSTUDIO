'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useTheme } from '@/lib/theme';
import { useCamera } from '@/lib/camera';

interface NavigationProps {
  isLoaded?: boolean;
}

export function Navigation({ isLoaded = false }: NavigationProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const { navigateToOverview, activeNodeId } = useCamera();

  return (
    <nav
      className="fixed top-0 left-0 w-full z-[100] pointer-events-none"
      style={{ padding: '20px 24px' }}
    >
      <div className="flex items-center justify-between">
        {/* Logo — hidden until loader completes, then fades in */}
        <motion.button
          className="relative pointer-events-auto cursor-pointer"
          style={{ width: 15, height: 32 }}
          onClick={navigateToOverview}
          aria-label="Overview"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.05 }}
        >
          <Image
            src="/images/sekt-logo.png"
            alt="SEKT STUDIO"
            fill
            sizes="15px"
            className="object-contain"
            style={{
              filter: isDark ? 'invert(1)' : 'invert(0)',
              transition: 'filter 0.5s ease',
            }}
          />
        </motion.button>

        {/* Right controls */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Active node label */}
          {activeNodeId && (
            <motion.span
              className="font-mono uppercase tracking-widest"
              style={{
                fontSize: '9px',
                color: 'var(--color-text-muted)',
              }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              {activeNodeId}
            </motion.span>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-10 h-10"
            data-cursor="pointer"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.svg
                  key="sun"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-secondary)"
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
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-secondary)"
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
        </div>
      </div>
    </nav>
  );
}
