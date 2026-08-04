'use client';

import { createContext, useContext, useRef, useCallback, useState, ReactNode } from 'react';
import { gsap } from 'gsap';
import { CAMERA_DEFAULTS, getNodeCenter, getNodeLayout, type NodeConfig } from './canvas-config';

// ─────────────────────────────────────────────
// Camera State (ref-based for 60fps)
// ─────────────────────────────────────────────
export interface CameraRef {
  x: number;
  y: number;
  zoom: number;
  vx: number;
  vy: number;
  isDragging: boolean;
  lastPointerX: number;
  lastPointerY: number;
  lastMoveTime: number;
  pinchStartDist: number;
  pinchStartZoom: number;
  pointers: Map<number, { x: number; y: number }>;
}

function createCameraRef(): CameraRef {
  return {
    x: 0,
    y: 0,
    zoom: CAMERA_DEFAULTS.initialZoom,
    vx: 0,
    vy: 0,
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    lastMoveTime: 0,
    pinchStartDist: 0,
    pinchStartZoom: 0,
    pointers: new Map(),
  };
}

// ─────────────────────────────────────────────
// Camera Context
// ─────────────────────────────────────────────
interface CameraContextValue {
  cameraRef: React.MutableRefObject<CameraRef>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
  navigateToNode: (node: NodeConfig) => void;
  navigateToOverview: () => void;
  applyTransform: () => void;
}

const CameraContext = createContext<CameraContextValue | null>(null);

export function useCamera() {
  const ctx = useContext(CameraContext);
  if (!ctx) throw new Error('useCamera must be used within CameraProvider');
  return ctx;
}

// ─────────────────────────────────────────────
// Camera Provider
// ─────────────────────────────────────────────
export function CameraProvider({ children }: { children: ReactNode }) {
  const cameraRef = useRef<CameraRef>(createCameraRef());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const applyTransform = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { x, y, zoom } = cameraRef.current;
    el.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
  }, []);

  // Cinematic fly-to node — responsive zoom
  const navigateToNode = useCallback(
    (node: NodeConfig) => {
      const cam = cameraRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;

      const center = getNodeCenter(node, isMobile);
      const layout = getNodeLayout(node, isMobile);

      // Calculate zoom to fit the node in the viewport
      const targetZoom = isMobile
        ? Math.min(vw / layout.width, vh / layout.height) * 0.92
        : node.focusZoom;

      const targetX = vw / 2 - center.x * targetZoom;
      const targetY = vh / 2 - center.y * targetZoom;

      cam.vx = 0;
      cam.vy = 0;

      gsap.to(cam, {
        x: targetX,
        y: targetY,
        zoom: targetZoom,
        duration: CAMERA_DEFAULTS.panDuration,
        ease: CAMERA_DEFAULTS.panEase,
        onUpdate: () => applyTransform(),
        onComplete: () => setActiveNodeId(node.id),
      });

      setActiveNodeId(node.id);
    },
    [applyTransform],
  );

  // Fly to overview
  const navigateToOverview = useCallback(() => {
    const cam = cameraRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const padding = 400;
    const overviewZoom = Math.min(
      vw / (7200 + padding * 2),
      vh / (4200 + padding * 2),
      0.15,
    );

    const targetX = vw / 2 - 3500 * overviewZoom;
    const targetY = vh / 2 - 1800 * overviewZoom;

    cam.vx = 0;
    cam.vy = 0;

    gsap.to(cam, {
      x: targetX,
      y: targetY,
      zoom: overviewZoom,
      duration: 1.4,
      ease: 'power3.inOut',
      onUpdate: () => applyTransform(),
    });

    setActiveNodeId(null);
  }, [applyTransform]);

  return (
    <CameraContext.Provider
      value={{
        cameraRef,
        containerRef,
        activeNodeId,
        setActiveNodeId,
        navigateToNode,
        navigateToOverview,
        applyTransform,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
}
