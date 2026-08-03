'use client';

import React, { memo } from 'react';
import { NODES, CONNECTIONS, getNodeCenter, getNodeById } from '@/lib/canvas-config';

interface ConnectionPathsProps {
  activeNodeId: string | null;
}

const ConnectionPaths = memo(({ activeNodeId }: ConnectionPathsProps) => {
  return (
    <>
      <style>{`
        @keyframes dashFlow {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -28; }
        }
      `}</style>
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
        {/* Draw paths */}
        {CONNECTIONS.map((conn, i) => {
          const fromNode = getNodeById(conn.from);
          const toNode = getNodeById(conn.to);
          if (!fromNode || !toNode) return null;

          const fromCenter = getNodeCenter(fromNode);
          const toCenter = getNodeCenter(toNode);

          const dx = toCenter.x - fromCenter.x;
          const dy = toCenter.y - fromCenter.y;

          // Organic bezier control points (offset perpendicular for curves)
          const mx = (fromCenter.x + toCenter.x) / 2;
          const my = (fromCenter.y + toCenter.y) / 2;
          const perpX = -dy * 0.15;
          const perpY = dx * 0.15;

          const pathD = `M ${fromCenter.x} ${fromCenter.y} Q ${mx + perpX} ${my + perpY}, ${toCenter.x} ${toCenter.y}`;

          const isActive = activeNodeId === conn.from || activeNodeId === conn.to;

          return (
            <path
              key={`conn-${i}`}
              d={pathD}
              fill="none"
              stroke={isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)'}
              strokeWidth={1}
              strokeDasharray="6 8"
              style={{
                animation: isActive ? 'dashFlow 1.5s linear infinite' : 'none',
                transition: 'stroke 0.6s ease',
              }}
            />
          );
        })}

        {/* Draw dots at node centers */}
        {NODES.map((node) => {
          const center = getNodeCenter(node);
          const isActive = activeNodeId === node.id;

          return (
            <circle
              key={`dot-${node.id}`}
              cx={center.x}
              cy={center.y}
              r={4}
              fill={isActive ? 'rgba(255,0,0,0.5)' : 'rgba(255,255,255,0.06)'}
              style={{ transition: 'fill 0.6s ease' }}
            />
          );
        })}
      </svg>
    </>
  );
});

ConnectionPaths.displayName = 'ConnectionPaths';

export { ConnectionPaths };
