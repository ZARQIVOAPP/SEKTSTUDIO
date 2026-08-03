'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useCamera } from '@/lib/camera';
import { CAMERA_DEFAULTS, NODES, getNodeById, getCanvasBounds } from '@/lib/canvas-config';
import { CanvasNode } from './CanvasNode';
import { ConnectionPaths } from './ConnectionPaths';
import { Minimap } from './Minimap';

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

  // ─── Clamp camera + center at overview zoom ───
  const clampCamera = useCallback(() => {
    const cam = cameraRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bounds = getCanvasBounds();
    const pad = 200;

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

  // ─── Hit test ───
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

  // ─── Wheel: trackpad pan/pinch + mouse zoom ───
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-node-content="active"]')) return;

      e.preventDefault();
      const cam = cameraRef.current;

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
        let dx = e.deltaX;
        let dy = e.deltaY;
        if (e.deltaMode === 1) { dx *= 16; dy *= 16; }

        if (Math.abs(dx) > 0.5) {
          cam.x -= dx * 1.2;
          cam.y -= dy * 1.2;
        } else {
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

  // ─── Initial camera: responsive overview ───
  useEffect(() => {
    const cam = cameraRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bounds = getCanvasBounds();
    const isMobile = vw < 768;
    const pad = isMobile ? 100 : 400;

    const zoom = Math.min(
      vw / (bounds.width + pad * 2),
      vh / (bounds.height + pad * 2),
      isMobile ? 0.06 : 0.18,
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

      {/* Minimap — hidden on mobile */}
      <div className="hidden sm:block">
        <Minimap onNodeClick={handleNodeClick} />
      </div>
    </div>
  );
}
