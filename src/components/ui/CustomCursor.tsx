'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from '@/lib/theme';

type CursorState = 'default' | 'pointer' | 'view' | 'drag';

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(true); // default true to avoid flash
  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);
  return isTouch;
}

export function CustomCursor() {
  const isTouchDevice = useIsTouchDevice();
  const { theme } = useTheme();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const dotX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const dotY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  const ringX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const [hoverState, setHoverState] = useState<CursorState>('default');

  useEffect(() => {
    if (isTouchDevice) return;

    document.documentElement.classList.add('has-custom-cursor');

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (!target) return;

      const dataCursor = target.closest('[data-cursor]');
      if (dataCursor) {
        const cursorVal = dataCursor.getAttribute('data-cursor');
        if (cursorVal === 'view' || cursorVal === 'drag' || cursorVal === 'pointer') {
          setHoverState(cursorVal);
          return;
        }
      }

      if (target.closest('a, button')) {
        setHoverState('pointer');
        return;
      }

      setHoverState('default');
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [isTouchDevice, mouseX, mouseY]);

  if (isTouchDevice) return null;

  const isActive = hoverState !== 'default';
  const hasText = hoverState === 'view' || hoverState === 'drag';
  const isLight = theme === 'light';

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 8,
          height: 8,
          backgroundColor: isLight ? '#0A0A0A' : '#F5F5F0',
          opacity: isActive ? 0 : 1,
          scale: isActive ? 0 : 1,
          zIndex: 9999,
        }}
        aria-hidden="true"
      />

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: isActive ? 60 : 0,
          height: isActive ? 60 : 0,
          backgroundColor: isActive ? (isLight ? '#0A0A0A' : '#FFFFFF') : 'transparent',
          zIndex: 9999,
        }}
        aria-hidden="true"
      >
        {hasText && (
          <span
            className="uppercase font-bold tracking-widest"
            style={{
              fontSize: '9px',
              color: isLight ? '#F5F5F0' : '#0A0A0A',
            }}
          >
            {hoverState === 'view' ? 'View' : 'Drag'}
          </span>
        )}
      </motion.div>
    </>
  );
}
