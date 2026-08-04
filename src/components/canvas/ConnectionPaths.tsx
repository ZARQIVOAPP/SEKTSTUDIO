'use client';

import { memo, useEffect, useState, useMemo, useRef } from 'react';
import { NODES, CONNECTIONS, getNodeCenter, getNodeById, getNodeLayout } from '@/lib/canvas-config';

interface ConnectionPathsProps {
  activeNodeId: string | null;
}

type LineStyle = 'arrows' | 'dotted' | 'solid' | 'dashed';
const CONNECTION_STYLES: Record<string, LineStyle> = {
  'hero-about': 'arrows',
  'hero-works': 'solid',
  'about-services': 'dashed',
  'works-process': 'dotted',
  'works-services': 'arrows',
  'process-journal': 'solid',
  'process-contact': 'dashed',
  'journal-contact': 'dotted',
};

function bezierPoint(
  fc: { x: number; y: number }, cp: { x: number; y: number },
  tc: { x: number; y: number }, t: number,
) {
  return {
    x: (1 - t) * (1 - t) * fc.x + 2 * (1 - t) * t * cp.x + t * t * tc.x,
    y: (1 - t) * (1 - t) * fc.y + 2 * (1 - t) * t * cp.y + t * t * tc.y,
  };
}

function bezierAngle(
  fc: { x: number; y: number }, cp: { x: number; y: number },
  tc: { x: number; y: number }, t: number,
) {
  const dx = 2 * (1 - t) * (cp.x - fc.x) + 2 * t * (tc.x - cp.x);
  const dy = 2 * (1 - t) * (cp.y - fc.y) + 2 * t * (tc.y - cp.y);
  return Math.atan2(dy, dx);
}

const ConnectionPaths = memo(({ activeNodeId }: ConnectionPathsProps) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let last = 0;
    const loop = (time: number) => {
      if (time - last > 33) {
        setTick(time);
        last = time;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted]);

  const paths = useMemo(() => {
    if (!mounted) return [];
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
      const perpX = -dy * 0.12;
      const perpY = dx * 0.12;
      const cp = { x: mx + perpX, y: my + perpY };

      // Round angles to avoid hydration mismatch
      const a1Pt = bezierPoint(fc, cp, tc, 0.35);
      const a1Ang = Math.round(bezierAngle(fc, cp, tc, 0.35) * 180 / Math.PI * 100) / 100;
      const a2Pt = bezierPoint(fc, cp, tc, 0.7);
      const a2Ang = Math.round(bezierAngle(fc, cp, tc, 0.7) * 180 / Math.PI * 100) / 100;

      return {
        id: conn.id, from: conn.from, to: conn.to,
        d: `M ${fc.x} ${fc.y} Q ${cp.x} ${cp.y}, ${tc.x} ${tc.y}`,
        style: CONNECTION_STYLES[conn.id] || 'solid' as LineStyle,
        fc, tc, cp,
        a1: { x: Math.round(a1Pt.x * 100) / 100, y: Math.round(a1Pt.y * 100) / 100, angle: a1Ang },
        a2: { x: Math.round(a2Pt.x * 100) / 100, y: Math.round(a2Pt.y * 100) / 100, angle: a2Ang },
      };
    }).filter(Boolean) as {
      id: string; from: string; to: string; d: string; style: LineStyle;
      fc: { x: number; y: number }; tc: { x: number; y: number }; cp: { x: number; y: number };
      a1: { x: number; y: number; angle: number }; a2: { x: number; y: number; angle: number };
    }[];
  }, [isMobile, mounted]);

  const dots = useMemo(() => {
    if (!mounted) return [];
    return NODES.map((node) => {
      const l = getNodeLayout(node, isMobile);
      return { id: node.id, x: l.x + l.width / 2, y: l.y + l.height / 2 };
    });
  }, [isMobile, mounted]);

  const arrowSize = isMobile ? 7 : 12;

  const flowingDots = useMemo(() => {
    if (!mounted) return [];
    const speed = 0.0004;
    return paths.map((path) => {
      return Array.from({ length: 3 }, (_, i) => {
        const t = ((tick * speed + i / 3) % 1);
        const pt = bezierPoint(path.fc, path.cp, path.tc, t);
        return { x: pt.x, y: pt.y, t };
      });
    });
  }, [paths, tick, mounted]);

  // Don't render until client-side mount
  if (!mounted) return null;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      {paths.map((path, pathIdx) => {
        const isActive = activeNodeId === path.from || activeNodeId === path.to;
        const lineStyle = path.style;

        const glowStroke = isActive ? 'rgba(255, 80, 80, 0.2)' : 'rgba(200, 60, 60, 0.06)';
        const mainStroke = isActive ? 'rgba(255, 90, 90, 0.8)' : 'rgba(200, 70, 70, 0.35)';
        const dotColor = isActive ? 'rgba(255, 120, 120, 1)' : 'rgba(220, 90, 90, 0.6)';

        const showArrows = lineStyle === 'arrows' || lineStyle === 'dashed';

        return (
          <g key={path.id}>
            {/* Glow */}
            <path d={path.d} fill="none" stroke={glowStroke}
              strokeWidth={isActive ? 20 : 10} strokeLinecap="round" />

            {/* Main line — all solid */}
            <path d={path.d} fill="none" stroke={mainStroke}
              strokeWidth={isActive ? 3 : 1.8} strokeLinecap="round" />

            {/* Direction arrows */}
            {showArrows && (
              <>
                <polygon
                  points={`0,0 ${-arrowSize},${-arrowSize * 0.45} ${-arrowSize * 0.7},0 ${-arrowSize},${arrowSize * 0.45}`}
                  fill={mainStroke}
                  transform={`translate(${path.a1.x}, ${path.a1.y}) rotate(${path.a1.angle})`}
                />
                <polygon
                  points={`0,0 ${-arrowSize},${-arrowSize * 0.45} ${-arrowSize * 0.7},0 ${-arrowSize},${arrowSize * 0.45}`}
                  fill={mainStroke}
                  transform={`translate(${path.a2.x}, ${path.a2.y}) rotate(${path.a2.angle})`}
                />
              </>
            )}

            {/* Flowing dots */}
            {flowingDots[pathIdx]?.map((fd, i) => (
              <circle key={i} cx={fd.x} cy={fd.y}
                r={isActive ? (isMobile ? 8 : 11) : (isMobile ? 5 : 8)}
                fill={dotColor} opacity={0.5 + fd.t * 0.5} />
            ))}
          </g>
        );
      })}

      {/* Node junction dots */}
      {dots.map((dot) => {
        const isActive = activeNodeId === dot.id;
        return (
          <g key={dot.id}>
            <circle cx={dot.x} cy={dot.y} r={isActive ? 22 : 14}
              fill="none" stroke={isActive ? 'rgba(255, 90, 90, 0.35)' : 'rgba(200, 70, 70, 0.1)'}
              strokeWidth={isActive ? 2 : 1} />
            <circle cx={dot.x} cy={dot.y} r={isActive ? 7 : 5}
              fill={isActive ? 'rgba(255, 100, 100, 0.9)' : 'rgba(200, 80, 80, 0.35)'}
              stroke={isActive ? 'rgba(255, 150, 150, 0.6)' : 'rgba(180, 60, 60, 0.15)'}
              strokeWidth={2} />
          </g>
        );
      })}
    </svg>
  );
});

ConnectionPaths.displayName = 'ConnectionPaths';
export { ConnectionPaths };
