'use client';

import { useEffect, useRef } from 'react';
import { NODES, CONNECTIONS, getNodeCenter, getNodeById, getCanvasBounds } from '@/lib/canvas-config';
import { useCamera } from '@/lib/camera';

interface MinimapProps {
  onNodeClick: (nodeId: string) => void;
}

// Pre-compute layout constants
const bounds = getCanvasBounds();
const pad = 600;
const logicalW = bounds.width + pad * 2;
const logicalH = bounds.height + pad * 2;
const mapW = 200;
const mapH = 140;
const scale = Math.min(mapW / logicalW, mapH / logicalH);
const oX = (mapW - logicalW * scale) / 2 - (bounds.minX - pad) * scale;
const oY = (mapH - logicalH * scale) / 2 - (bounds.minY - pad) * scale;
const tx = (x: number) => x * scale + oX;
const ty = (y: number) => y * scale + oY;
const tw = (w: number) => w * scale;
const th = (h: number) => h * scale;

export function Minimap({ onNodeClick }: MinimapProps) {
  const { cameraRef, activeNodeId } = useCamera();
  const viewportRef = useRef<SVGRectElement>(null);

  // Update viewport indicator via RAF — direct DOM, NO React state
  useEffect(() => {
    let frame: number;
    const update = () => {
      const cam = cameraRef.current;
      const el = viewportRef.current;
      if (el) {
        const z = cam.zoom || 0.1;
        el.setAttribute('x', String(tx(-cam.x / z)));
        el.setAttribute('y', String(ty(-cam.y / z)));
        el.setAttribute('width', String(tw(window.innerWidth / z)));
        el.setAttribute('height', String(th(window.innerHeight / z)));
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [cameraRef]);

  return (
    <div
      className="backdrop-blur-md"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 80,
        width: mapW,
        height: mapH,
        borderRadius: 10,
        overflow: 'hidden',
        pointerEvents: 'auto',
        backgroundColor: 'rgba(17,17,17,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
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
          const fc = getNodeCenter(fromNode);
          const tc = getNodeCenter(toNode);
          return (
            <line
              key={i}
              x1={tx(fc.x)}
              y1={ty(fc.y)}
              x2={tx(tc.x)}
              y2={ty(tc.y)}
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
        return (
          <div
            key={node.id}
            onClick={() => onNodeClick(node.id)}
            style={{
              position: 'absolute',
              left: tx(node.x),
              top: ty(node.y),
              width: Math.max(4, tw(node.width)),
              height: Math.max(3, th(node.height)),
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
