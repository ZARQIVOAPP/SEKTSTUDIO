'use client';

import { type ReactNode, memo, useEffect, useState } from 'react';
import { getNodeLayout, type NodeConfig } from '@/lib/canvas-config';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const layout = getNodeLayout(node, isMobile);

  return (
    <div
      className="absolute"
      style={{
        left: layout.x,
        top: layout.y,
        width: layout.width,
        height: layout.height,
      }}
    >
      <div
        className="relative w-full h-full"
        style={{
          border: isActive
            ? `${isMobile ? '2px' : '6px'} solid var(--color-text-primary)`
            : `${isMobile ? '1px' : '4px'} solid var(--color-text-secondary)`,
          backgroundColor: 'var(--color-bg-primary)',
          opacity: isActive ? 1 : 0.9,
          boxShadow: isActive
            ? isMobile
              ? '0 0 20px rgba(255,255,255,0.08)'
              : '0 0 100px rgba(255,255,255,0.15), 0 0 0 3px var(--color-text-primary)'
            : isMobile
              ? '0 0 10px rgba(255,255,255,0.04)'
              : '0 0 50px rgba(255,255,255,0.1), 0 0 0 2px var(--color-text-secondary)',
          transition: 'opacity 0.6s ease, border-color 0.4s ease, box-shadow 0.6s ease',
          overflow: 'hidden',
        }}
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
            className="font-mono uppercase block"
            style={{
              fontSize: isMobile ? '10px' : '22px',
              letterSpacing: isMobile ? '0.2em' : '0.5em',
              color: 'var(--color-text-secondary)',
              marginBottom: isMobile ? '8px' : '20px',
            }}
          >
            {node.sectionIndex}
          </span>

          <span
            className="font-display font-bold uppercase tracking-tight"
            style={{
              fontSize: isMobile ? '1.4rem' : 'clamp(3.5rem, 7vw, 8rem)',
              color: 'var(--color-text-primary)',
              lineHeight: 1,
              textAlign: 'center',
              padding: isMobile ? '0 8px' : 0,
            }}
          >
            {node.label}
          </span>

          <div
            style={{
              width: isMobile ? '24px' : '60px',
              height: '2px',
              backgroundColor: 'var(--color-accent)',
              marginTop: isMobile ? '10px' : '24px',
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
