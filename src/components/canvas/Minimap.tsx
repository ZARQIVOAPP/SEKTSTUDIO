'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { NODES, CONNECTIONS, getNodeCenter, getNodeById, getCanvasBounds, getNodeLayout } from '@/lib/canvas-config';
import { useCamera } from '@/lib/camera';

interface MinimapProps {
  onNodeClick: (nodeId: string) => void;
}

const mapW = 200;
const mapH = 140;

export function Minimap({ onNodeClick }: MinimapProps) {
  const { cameraRef, activeNodeId } = useCamera();
  const viewportRef = useRef<SVGRectElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Compute layout constants based on screen size
  const layout = useMemo(() => {
    const bounds = getCanvasBounds(isMobile);
    const pad = 600;
    const logicalW = bounds.width + pad * 2;
    const logicalH = bounds.height + pad * 2;
    const scale = Math.min(mapW / logicalW, mapH / logicalH);
    const oX = (mapW - logicalW * scale) / 2 - (bounds.minX - pad) * scale;
    const oY = (mapH - logicalH * scale) / 2 - (bounds.minY - pad) * scale;

    return {
      scale,
      oX,
      oY,
      tx: (x: number) => x * scale + oX,
      ty: (y: number) => y * scale + oY,
      tw: (w: number) => w * scale,
      th: (h: number) => h * scale,
    };
  }, [isMobile]);

  // Update viewport indicator via RAF
  useEffect(() => {
    let frame: number;
    const update = () => {
      const cam = cameraRef.current;
      const el = viewportRef.current;
      if (el) {
        const z = cam.zoom || 0.1;
        el.setAttribute('x', String(layout.tx(-cam.x / z)));
        el.setAttribute('y', String(layout.ty(-cam.y / z)));
        el.setAttribute('width', String(layout.tw(window.innerWidth / z)));
        el.setAttribute('height', String(layout.th(window.innerHeight / z)));
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [cameraRef, layout]);

  const isInsideNode = !!activeNodeId;

  return (
    <div
      className="backdrop-blur-md"
      style={{
        position: 'fixed',
        bottom: isMobile ? 12 : 24,
        right: isMobile ? 12 : 24,
        zIndex: 80,
        width: isMobile ? 140 : mapW,
        height: isMobile ? 100 : mapH,
        borderRadius: 10,
        overflow: 'hidden',
        pointerEvents: 'auto',
        backgroundColor: 'rgba(17,17,17,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        opacity: isInsideNode ? 0.4 : 1,
        transition: 'opacity 0.4s ease',
        transform: isMobile ? `scale(${140 / mapW})` : undefined,
        transformOrigin: 'bottom right',
      }}
    >
      {/* Label */}
      <div
        className="font-mono uppercase tracking-widest"
        style={{
          position: 'absolute',
          top: 6,
          left: 8,
          fontSize: '6px',
          color: 'rgba(255,255,255,0.3)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        MAP
      </div>

      {/* SVG: connections + viewport */}
      <svg
        width={mapW}
        height={mapH}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        {CONNECTIONS.map((conn, i) => {
          const fromNode = getNodeById(conn.from);
          const toNode = getNodeById(conn.to);
          if (!fromNode || !toNode) return null;
          const fc = getNodeCenter(fromNode, isMobile);
          const tc = getNodeCenter(toNode, isMobile);
          return (
            <line
              key={i}
              x1={layout.tx(fc.x)}
              y1={layout.ty(fc.y)}
              x2={layout.tx(tc.x)}
              y2={layout.ty(tc.y)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={0.5}
            />
          );
        })}
        <rect
          ref={viewportRef}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={1}
          rx={1}
        />
      </svg>

      {/* Node rectangles */}
      {NODES.map((node) => {
        const isActive = activeNodeId === node.id;
        const nl = getNodeLayout(node, isMobile);
        return (
          <div
            key={node.id}
            onClick={() => onNodeClick(node.id)}
            style={{
              position: 'absolute',
              left: layout.tx(nl.x),
              top: layout.ty(nl.y),
              width: Math.max(4, layout.tw(nl.width)),
              height: Math.max(3, layout.th(nl.height)),
              border: `1px solid ${isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.12)'}`,
              cursor: 'pointer',
              backgroundColor: isActive ? 'rgba(255,0,0,0.2)' : 'rgba(255,255,255,0.03)',
              transition: 'background-color 0.3s, border-color 0.3s',
            }}
          >
            <span
              className="font-mono"
              style={{
                position: 'absolute',
                bottom: -9,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '5px',
                color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
