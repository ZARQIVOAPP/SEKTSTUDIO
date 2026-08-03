'use client';

import { type ReactNode, memo } from 'react';
import { motion } from 'motion/react';
import type { NodeConfig } from '@/lib/canvas-config';

interface CanvasNodeProps {
  node: NodeConfig;
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}

export const CanvasNode = memo(function CanvasNode({
  node,
  isActive,
  onClick,
  children,
}: CanvasNodeProps) {
  return (
    <div
      className="absolute"
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
        height: node.height,
      }}
    >
      <motion.div
        className="relative w-full h-full overflow-hidden"
        style={{
          border: `1px solid ${isActive ? 'var(--color-border)' : 'var(--color-border)'}`,
          backgroundColor: 'var(--color-bg-primary)',
          transition: 'border-color 0.6s ease',
        }}
        animate={{
          opacity: isActive ? 1 : 0.5,
          filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
          scale: isActive ? 1 : 0.98,
        }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* ─── Node Label (visible when unfocused) ─── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 10 }}
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Section Index */}
          <span
            className="font-mono uppercase tracking-[0.5em] block"
            style={{
              fontSize: '18px',
              color: 'var(--color-text-muted)',
              marginBottom: '16px',
            }}
          >
            {node.sectionIndex}
          </span>

          {/* Section Title — big and bold */}
          <span
            className="font-display font-bold uppercase tracking-tight"
            style={{
              fontSize: 'clamp(3rem, 6vw, 7rem)',
              color: 'var(--color-text-primary)',
              lineHeight: 1,
              textAlign: 'center',
            }}
          >
            {node.label}
          </span>

          {/* Decorative line */}
          <div
            style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--color-accent)',
              marginTop: '20px',
              opacity: 0.6,
            }}
          />
        </motion.div>

        {/* ─── Full section content (only rendered when active) ─── */}
        {isActive && (
          <motion.div
            className="w-full h-full overflow-auto"
            data-node-content="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 5,
              touchAction: 'pan-y',
            }}
          >
            {children}
          </motion.div>
        )}
      </motion.div>

      {/* ─── Click target for unfocused nodes ─── */}
      {!isActive && (
        <div
          className="absolute inset-0"
          style={{ zIndex: 20, cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          data-cursor="view"
        />
      )}
    </div>
  );
});
