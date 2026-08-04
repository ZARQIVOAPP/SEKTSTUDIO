'use client';

import { memo, useEffect, useState, useMemo } from 'react';
import { NODES, CONNECTIONS, getNodeCenter, getNodeById, getNodeLayout } from '@/lib/canvas-config';

interface ConnectionPathsProps {
  activeNodeId: string | null;
}

const ConnectionPaths = memo(({ activeNodeId }: ConnectionPathsProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Compute paths based on screen size
  const paths = useMemo(() => {
    return CONNECTIONS.map((conn) => {
      const fromNode = getNodeById(conn.from);
      const toNode = getNodeById(conn.to);
      if (!fromNode || !toNode) return null;

      const fc = getNodeCenter(fromNode, isMobile);
      const tc = getNodeCenter(toNode, isMobile);
      const dx = tc.x - fc.x;
      const dy = tc.y - fc.y;
      const mx = (fc.x + tc.x) / 2;
      const my = (fc.y + tc.y) / 2;
      const perpX = -dy * 0.15;
      const perpY = dx * 0.15;

      return {
        id: conn.id,
        from: conn.from,
        to: conn.to,
        d: `M ${fc.x} ${fc.y} Q ${mx + perpX} ${my + perpY}, ${tc.x} ${tc.y}`,
      };
    }).filter(Boolean) as { id: string; from: string; to: string; d: string }[];
  }, [isMobile]);

  const dots = useMemo(() => {
    return NODES.map((node) => {
      const l = getNodeLayout(node, isMobile);
      return {
        id: node.id,
        x: l.x + l.width / 2,
        y: l.y + l.height / 2,
      };
    });
  }, [isMobile]);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      {paths.map((path) => {
        const isActive = activeNodeId === path.from || activeNodeId === path.to;
        return (
          <g key={path.id}>
            <path
              d={path.d}
              fill="none"
              stroke={isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}
              strokeWidth={isActive ? 10 : 6}
              strokeLinecap="round"
            />
            <path
              d={path.d}
              fill="none"
              stroke={isActive ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}
              strokeWidth={isActive ? 3 : 2}
              strokeDasharray={isActive ? 'none' : '10 8'}
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {dots.map((dot) => (
        <g key={dot.id}>
          <circle
            cx={dot.x}
            cy={dot.y}
            r={activeNodeId === dot.id ? 16 : 10}
            fill={activeNodeId === dot.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)'}
          />
          <circle
            cx={dot.x}
            cy={dot.y}
            r={activeNodeId === dot.id ? 6 : 5}
            fill={activeNodeId === dot.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)'}
            stroke={activeNodeId === dot.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}
            strokeWidth={1.5}
          />
        </g>
      ))}
    </svg>
  );
});

ConnectionPaths.displayName = 'ConnectionPaths';
export { ConnectionPaths };
