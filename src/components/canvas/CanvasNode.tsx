'use client';

import { type ReactNode, memo } from 'react';
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
      className="absolute transition-all duration-300"
      style={{
        left: node.x + node.width / 2,
        top: node.y + node.height / 2,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="relative w-[360px] h-[680px] md:w-[var(--desktop-w)] md:h-[var(--desktop-h)]"
        style={{
          '--desktop-w': `${node.width}px`,
          '--desktop-h': `${node.height}px`,
          border: isActive
            ? '6px solid var(--color-text-primary)'
            : '4px solid var(--color-text-secondary)',
          backgroundColor: 'var(--color-bg-primary)',
          opacity: isActive ? 1 : 0.9,
          boxShadow: isActive
            ? '0 0 100px rgba(255,255,255,0.15), 0 0 0 3px var(--color-text-primary)'
            : '0 0 50px rgba(255,255,255,0.1), 0 0 0 2px var(--color-text-secondary)',
          transition: 'opacity 0.6s ease, border-color 0.4s ease, box-shadow 0.6s ease',
          overflow: 'hidden',
        } as React.CSSProperties}
      >
        {/* ─── Node Label ─── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 10,
            opacity: isActive ? 0 : 1,
            transition: 'opacity 0.4s ease',
          }}
        >
          <span
            className="font-mono uppercase tracking-[0.5em] block"
            style={{
              fontSize: '22px',
              color: 'var(--color-text-secondary)',
              marginBottom: '20px',
            }}
          >
            {node.sectionIndex}
          </span>

          <span
            className="font-display font-bold uppercase tracking-tight"
            style={{
              fontSize: 'clamp(3.5rem, 7vw, 8rem)',
              color: 'var(--color-text-primary)',
              lineHeight: 1,
              textAlign: 'center',
            }}
          >
            {node.label}
          </span>

          <div
            style={{
              width: '60px',
              height: '3px',
              backgroundColor: 'var(--color-accent)',
              marginTop: '24px',
            }}
          />
        </div>

        {/* ─── Section content ─── */}
        {isActive && (
          <div
            className="w-full h-full overflow-auto"
            data-node-content="active"
            style={{
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 5,
              touchAction: 'pan-y',
            }}
          >
            {children}
          </div>
        )}
      </div>

      {/* Click target */}
      {!isActive && (
        <div
          className="absolute inset-0"
          style={{ zIndex: 20, cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
      )}
    </div>
  );
});
