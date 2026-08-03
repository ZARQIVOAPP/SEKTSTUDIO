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

// Map section IDs to components
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
  // Track pointer start for click-vs-drag detection
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // ─── Momentum Decay Loop ───
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
      applyTransform();
      rafRef.current = requestAnimationFrame(decay);
    };

    rafRef.current = requestAnimationFrame(decay);
  }, [cameraRef, applyTransform]);

  // ─── Check if a point is inside an active node ───
  const isInsideActiveNode = useCallback(
    (clientX: number, clientY: number): boolean => {
      if (!activeNodeId) return false;
      const node = getNodeById(activeNodeId);
      if (!node) return false;
      const cam = cameraRef.current;

      // Convert client coords to canvas coords
      const canvasX = (clientX - cam.x) / cam.zoom;
      const canvasY = (clientY - cam.y) / cam.zoom;

      return (
        canvasX >= node.x &&
        canvasX <= node.x + node.width &&
        canvasY >= node.y &&
        canvasY <= node.y + node.height
      );
    },
    [activeNodeId, cameraRef],
  );

  // ─── Find which node is at a screen position ───
  const findNodeAtPosition = useCallback(
    (clientX: number, clientY: number): string | null => {
      const cam = cameraRef.current;
      const canvasX = (clientX - cam.x) / cam.zoom;
      const canvasY = (clientY - cam.y) / cam.zoom;

      for (const node of NODES) {
        if (
          canvasX >= node.x &&
          canvasX <= node.x + node.width &&
          canvasY >= node.y &&
          canvasY <= node.y + node.height
        ) {
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
      // Don't capture events on the active node's content
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

      // Pinch zoom (2 fingers)
      if (cam.pointers.size === 2) {
        const pts = Array.from(cam.pointers.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const centerX = (pts[0].x + pts[1].x) / 2;
        const centerY = (pts[0].y + pts[1].y) / 2;
        const scale = dist / cam.pinchStartDist;
        const newZoom = Math.max(
          CAMERA_DEFAULTS.minZoom,
          Math.min(CAMERA_DEFAULTS.maxZoom, cam.pinchStartZoom * scale),
        );

        const zoomRatio = newZoom / cam.zoom;
        cam.x = centerX - (centerX - cam.x) * zoomRatio;
        cam.y = centerY - (centerY - cam.y) * zoomRatio;
        cam.zoom = newZoom;
        applyTransform();
        return;
      }

      // Single pointer drag
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

      applyTransform();
    },
    [cameraRef, applyTransform],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const cam = cameraRef.current;
      cam.pointers.delete(e.pointerId);

      if (cam.pointers.size === 0) {
        cam.isDragging = false;

        // Click detection: if pointer barely moved, treat as click
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

  // ─── Wheel: zoom canvas OR scroll inside active node ───
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // If scrolling inside an active node's content, let it scroll normally
      const target = e.target as HTMLElement;
      if (target.closest('[data-node-content="active"]')) {
        return; // Don't prevent default — let the node content scroll
      }

      e.preventDefault();
      const cam = cameraRef.current;

      const zoomFactor = e.deltaY > 0 ? 0.92 : 1.08;
      const newZoom = Math.max(
        CAMERA_DEFAULTS.minZoom,
        Math.min(CAMERA_DEFAULTS.maxZoom, cam.zoom * zoomFactor),
      );

      const zoomRatio = newZoom / cam.zoom;
      cam.x = e.clientX - (e.clientX - cam.x) * zoomRatio;
      cam.y = e.clientY - (e.clientY - cam.y) * zoomRatio;
      cam.zoom = newZoom;

      applyTransform();
    },
    [cameraRef, applyTransform],
  );

  // ─── Attach wheel listener (non-passive for preventDefault) ───
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ─── Initial camera position: overview showing all nodes ───
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
    cam.x = vw / 2 - cx * zoom;
    cam.y = vh / 2 - cy * zoom;
    cam.zoom = zoom;
    applyTransform();
  }, [cameraRef, applyTransform]);

  // ─── Handle node click from minimap ───
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
      {/* The transformed canvas world */}
      <div
        ref={containerRef}
        className="absolute top-0 left-0"
        style={{
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {/* SVG Connection Paths */}
        <ConnectionPaths activeNodeId={activeNodeId} />

        {/* Nodes */}
        {NODES.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            isActive={activeNodeId === node.id}
            onClick={() => handleNodeClick(node.id)}
          >
            {SECTION_COMPONENTS[node.id] ? (
              (() => {
                const Component = SECTION_COMPONENTS[node.id];
                return <Component />;
              })()
            ) : null}
          </CanvasNode>
        ))}
      </div>

      {/* Minimap (fixed UI, outside canvas transform) */}
      <Minimap onNodeClick={handleNodeClick} />
    </div>
  );
}
