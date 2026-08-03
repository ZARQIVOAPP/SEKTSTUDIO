'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useCamera } from '@/lib/camera';
import { CAMERA_DEFAULTS, NODES, getNodeById, getCanvasBounds } from '@/lib/canvas-config';
import { CanvasNode } from './CanvasNode';
import { ConnectionPaths } from './ConnectionPaths';
import { Minimap } from './Minimap';
import { motion, AnimatePresence } from 'motion/react';

// Section imports
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Works } from '@/components/sections/Works';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { Journal } from '@/components/sections/Journal';
import { Contact } from '@/components/sections/Contact';

const SECTION_COMPONENTS: Record<string, React.ComponentType<Record<string, never>>> = {
  hero: Hero as React.ComponentType<Record<string, never>>,
  about: About,
  works: Works,
  services: Services,
  process: Process,
  journal: Journal,
  contact: Contact,
};

export function CanvasWorld() {
  const {
    cameraRef,
    containerRef,
    activeNodeId,
    navigateToNode,
    applyTransform,
  } = useCamera();

  const rafRef = useRef<number>(0);
  const isDecaying = useRef(false);
  const outerRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const overviewZoomRef = useRef<number>(CAMERA_DEFAULTS.minZoom);
  const overviewPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showDock, setShowDock] = useState(true);

  // ─── Clamp camera + center at overview zoom ───
  const clampCamera = useCallback(() => {
    const cam = cameraRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bounds = getCanvasBounds();
    const pad = 200;

    // At overview zoom, snap to centered position
    if (cam.zoom <= overviewZoomRef.current * 1.05) {
      cam.zoom = overviewZoomRef.current;
      cam.x = overviewPosRef.current.x;
      cam.y = overviewPosRef.current.y;
      return;
    }

    const minCamX = vw - (bounds.maxX + pad) * cam.zoom;
    const maxCamX = -(bounds.minX - pad) * cam.zoom;
    const minCamY = vh - (bounds.maxY + pad) * cam.zoom;
    const maxCamY = -(bounds.minY - pad) * cam.zoom;

    if (minCamX < maxCamX) {
      cam.x = Math.max(minCamX, Math.min(maxCamX, cam.x));
    } else {
      cam.x = (minCamX + maxCamX) / 2;
    }
    if (minCamY < maxCamY) {
      cam.y = Math.max(minCamY, Math.min(maxCamY, cam.y));
    } else {
      cam.y = (minCamY + maxCamY) / 2;
    }
  }, [cameraRef]);

  // ─── Momentum Decay ───
  const startDecay = useCallback(() => {
    if (isDecaying.current) return;
    isDecaying.current = true;

    const decay = () => {
      const cam = cameraRef.current;
      if (cam.isDragging || (Math.abs(cam.vx) < CAMERA_DEFAULTS.velocityThreshold && Math.abs(cam.vy) < CAMERA_DEFAULTS.velocityThreshold)) {
        cam.vx = 0;
        cam.vy = 0;
        isDecaying.current = false;
        return;
      }

      cam.x += cam.vx;
      cam.y += cam.vy;
      cam.vx *= CAMERA_DEFAULTS.friction;
      cam.vy *= CAMERA_DEFAULTS.friction;
      clampCamera();
      applyTransform();
      rafRef.current = requestAnimationFrame(decay);
    };

    rafRef.current = requestAnimationFrame(decay);
  }, [cameraRef, applyTransform, clampCamera]);

  // ─── Hit test helpers ───
  const findNodeAtPosition = useCallback(
    (clientX: number, clientY: number): string | null => {
      const cam = cameraRef.current;
      const canvasX = (clientX - cam.x) / cam.zoom;
      const canvasY = (clientY - cam.y) / cam.zoom;

      for (const node of NODES) {
        if (canvasX >= node.x && canvasX <= node.x + node.width &&
            canvasY >= node.y && canvasY <= node.y + node.height) {
          return node.id;
        }
      }
      return null;
    },
    [cameraRef],
  );

  // ─── Pointer Events ───
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-node-content="active"]')) return;

      const cam = cameraRef.current;
      cam.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (cam.pointers.size === 1) {
        cam.isDragging = true;
        cam.lastPointerX = e.clientX;
        cam.lastPointerY = e.clientY;
        cam.vx = 0;
        cam.vy = 0;
        cam.lastMoveTime = performance.now();
        pointerStartRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
      }

      if (cam.pointers.size === 2) {
        const pts = Array.from(cam.pointers.values());
        cam.pinchStartDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        cam.pinchStartZoom = cam.zoom;
      }
    },
    [cameraRef],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const cam = cameraRef.current;
      cam.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (cam.pointers.size === 2) {
        const pts = Array.from(cam.pointers.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const centerX = (pts[0].x + pts[1].x) / 2;
        const centerY = (pts[0].y + pts[1].y) / 2;
        const scale = dist / cam.pinchStartDist;
        const newZoom = Math.max(
          overviewZoomRef.current,
          Math.min(CAMERA_DEFAULTS.maxZoom, cam.pinchStartZoom * scale),
        );

        const zoomRatio = newZoom / cam.zoom;
        cam.x = centerX - (centerX - cam.x) * zoomRatio;
        cam.y = centerY - (centerY - cam.y) * zoomRatio;
        cam.zoom = newZoom;
        clampCamera();
        applyTransform();
        return;
      }

      if (!cam.isDragging || cam.pointers.size !== 1) return;

      const now = performance.now();
      const dt = Math.max(1, now - cam.lastMoveTime);
      const dx = e.clientX - cam.lastPointerX;
      const dy = e.clientY - cam.lastPointerY;

      cam.x += dx;
      cam.y += dy;

      const alpha = 0.3;
      cam.vx = alpha * (dx / dt) * 16 + (1 - alpha) * cam.vx;
      cam.vy = alpha * (dy / dt) * 16 + (1 - alpha) * cam.vy;

      cam.lastPointerX = e.clientX;
      cam.lastPointerY = e.clientY;
      cam.lastMoveTime = now;

      clampCamera();
      applyTransform();
    },
    [cameraRef, applyTransform, clampCamera],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const cam = cameraRef.current;
      cam.pointers.delete(e.pointerId);

      if (cam.pointers.size === 0) {
        cam.isDragging = false;

        const start = pointerStartRef.current;
        if (start) {
          const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y);
          const elapsed = performance.now() - start.time;
          if (dist < 8 && elapsed < 500) {
            const nodeId = findNodeAtPosition(e.clientX, e.clientY);
            if (nodeId && nodeId !== activeNodeId) {
              const node = getNodeById(nodeId);
              if (node) navigateToNode(node);
            }
          }
          pointerStartRef.current = null;
        }

        startDecay();
      } else if (cam.pointers.size === 1) {
        const remaining = Array.from(cam.pointers.values())[0];
        cam.lastPointerX = remaining.x;
        cam.lastPointerY = remaining.y;
      }
    },
    [cameraRef, startDecay, findNodeAtPosition, activeNodeId, navigateToNode],
  );

  // ─── Wheel: trackpad pan/pinch + mouse wheel zoom ───
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-node-content="active"]')) return;

      e.preventDefault();
      const cam = cameraRef.current;

      // Pinch-to-zoom (ctrlKey is set by browser for trackpad pinch)
      if (e.ctrlKey) {
        const zoomDelta = -e.deltaY * 0.008;
        const newZoom = Math.max(
          overviewZoomRef.current,
          Math.min(CAMERA_DEFAULTS.maxZoom, cam.zoom * (1 + zoomDelta)),
        );
        const zoomRatio = newZoom / cam.zoom;
        cam.x = e.clientX - (e.clientX - cam.x) * zoomRatio;
        cam.y = e.clientY - (e.clientY - cam.y) * zoomRatio;
        cam.zoom = newZoom;
      } else {
        // Normalize deltaMode (some browsers report in lines not pixels)
        let dx = e.deltaX;
        let dy = e.deltaY;
        if (e.deltaMode === 1) { dx *= 16; dy *= 16; }

        // If horizontal movement: definitely a trackpad pan
        if (Math.abs(dx) > 0.5) {
          cam.x -= dx * 1.2;
          cam.y -= dy * 1.2;
        } else {
          // Pure vertical = mouse wheel → zoom
          const zoomFactor = dy > 0 ? CAMERA_DEFAULTS.zoomOut : CAMERA_DEFAULTS.zoomIn;
          const newZoom = Math.max(
            overviewZoomRef.current,
            Math.min(CAMERA_DEFAULTS.maxZoom, cam.zoom * zoomFactor),
          );
          const zoomRatio = newZoom / cam.zoom;
          cam.x = e.clientX - (e.clientX - cam.x) * zoomRatio;
          cam.y = e.clientY - (e.clientY - cam.y) * zoomRatio;
          cam.zoom = newZoom;
        }
      }

      clampCamera();
      applyTransform();
    },
    [cameraRef, applyTransform, clampCamera],
  );

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ─── Initial camera: overview centered ───
  useEffect(() => {
    const cam = cameraRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bounds = getCanvasBounds();
    const pad = 400;

    const zoom = Math.min(
      vw / (bounds.width + pad * 2),
      vh / (bounds.height + pad * 2),
      0.18,
    );

    const cx = bounds.minX + bounds.width / 2;
    const cy = bounds.minY + bounds.height / 2;
    const camX = vw / 2 - cx * zoom;
    const camY = vh / 2 - cy * zoom;

    overviewZoomRef.current = zoom;
    overviewPosRef.current = { x: camX, y: camY };

    cam.x = camX;
    cam.y = camY;
    cam.zoom = zoom;
    applyTransform();
  }, [cameraRef, applyTransform]);

  // ─── Navigate to node ───
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const node = getNodeById(nodeId);
      if (node) navigateToNode(node);
    },
    [navigateToNode],
  );

  // ─── Return to overview ───
  const returnToOverview = useCallback(() => {
    const cam = cameraRef.current;
    const target = overviewPosRef.current;
    const targetZoom = overviewZoomRef.current;

    // Animate to overview
    const startX = cam.x, startY = cam.y, startZoom = cam.zoom;
    const startTime = performance.now();
    const duration = 1200;

    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const t = ease(Math.min(1, elapsed / duration));

      cam.x = startX + (target.x - startX) * t;
      cam.y = startY + (target.y - startY) * t;
      cam.zoom = startZoom + (targetZoom - startZoom) * t;
      applyTransform();

      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [cameraRef, applyTransform]);

  // Show/hide dock based on zoom level
  useEffect(() => {
    const check = () => {
      const cam = cameraRef.current;
      setShowDock(cam.zoom < overviewZoomRef.current * 3);
    };
    const interval = setInterval(check, 300);
    return () => clearInterval(interval);
  }, [cameraRef]);

  return (
    <div
      ref={outerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        touchAction: 'none',
        cursor: 'grab',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Static grain texture */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
        }}
      />

      {/* Canvas world */}
      <div
        ref={containerRef}
        className="absolute top-0 left-0"
        style={{ transformOrigin: '0 0', willChange: 'transform' }}
      >
        <ConnectionPaths activeNodeId={activeNodeId} />
        {NODES.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            isActive={activeNodeId === node.id}
            onClick={() => handleNodeClick(node.id)}
          >
            {SECTION_COMPONENTS[node.id] ? (
              (() => { const C = SECTION_COMPONENTS[node.id]; return <C />; })()
            ) : null}
          </CanvasNode>
        ))}
      </div>

      {/* ─── Node Navigation Dock ─── */}
      <AnimatePresence>
        {showDock && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-full backdrop-blur-xl"
            style={{
              backgroundColor: 'rgba(17,17,17,0.75)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {NODES.map((node) => {
              const isActive = activeNodeId === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  className="relative font-mono uppercase tracking-wider transition-all duration-300 rounded-full whitespace-nowrap"
                  style={{
                    fontSize: '8px',
                    padding: isActive ? '6px 14px' : '6px 10px',
                    color: isActive ? 'var(--color-bg-primary)' : 'rgba(255,255,255,0.5)',
                    backgroundColor: isActive ? 'var(--color-text-primary)' : 'transparent',
                    border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {node.label}
                </button>
              );
            })}

            {/* Overview button */}
            {activeNodeId && (
              <button
                onClick={returnToOverview}
                className="font-mono uppercase tracking-wider rounded-full transition-all duration-300 ml-1"
                style={{
                  fontSize: '8px',
                  padding: '6px 10px',
                  color: 'var(--color-accent)',
                  border: '1px solid var(--color-accent)',
                  backgroundColor: 'transparent',
                }}
              >
                ← ALL
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimap */}
      <Minimap onNodeClick={handleNodeClick} />
    </div>
  );
}
