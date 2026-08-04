'use client';

import { createContext, useContext, useRef, useCallback, useState, ReactNode } from 'react';
import { gsap } from 'gsap';
import { CAMERA_DEFAULTS, getNodeCenter, getNodeLayout, getCanvasBounds, type NodeConfig } from './canvas-config';

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
    x: 0, y: 0,
    zoom: CAMERA_DEFAULTS.initialZoom,
    vx: 0, vy: 0,
    isDragging: false,
    lastPointerX: 0, lastPointerY: 0,
    lastMoveTime: 0,
    pinchStartDist: 0, pinchStartZoom: 0,
    pointers: new Map(),
  };
}

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

  // Fly-to node — responsive
  const navigateToNode = useCallback(
    (node: NodeConfig) => {
      const cam = cameraRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;

      const center = getNodeCenter(node, isMobile);
      const layout = getNodeLayout(node, isMobile);

      const targetZoom = isMobile
        ? Math.min(vw / layout.width, vh / layout.height) * 0.92
        : node.focusZoom;

      const targetX = vw / 2 - center.x * targetZoom;
      const targetY = vh / 2 - center.y * targetZoom;

      cam.vx = 0;
      cam.vy = 0;

      gsap.to(cam, {
        x: targetX, y: targetY, zoom: targetZoom,
        duration: CAMERA_DEFAULTS.panDuration,
        ease: CAMERA_DEFAULTS.panEase,
        onUpdate: () => applyTransform(),
        onComplete: () => setActiveNodeId(node.id),
      });

      setActiveNodeId(node.id);
    },
    [applyTransform],
  );

  // Fly to overview — uses ACTUAL canvas bounds (mobile-aware)
  const navigateToOverview = useCallback(() => {
    const cam = cameraRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 768;
    const bounds = getCanvasBounds(isMobile);
    const pad = isMobile ? 80 : 400;

    const overviewZoom = Math.min(
      vw / (bounds.width + pad * 2),
      vh / (bounds.height + pad * 2),
      isMobile ? 0.6 : 0.18,
    );

    const cx = bounds.minX + bounds.width / 2;
    const cy = bounds.minY + bounds.height / 2;
    const targetX = vw / 2 - cx * overviewZoom;
    const targetY = vh / 2 - cy * overviewZoom;

    cam.vx = 0;
    cam.vy = 0;

    gsap.to(cam, {
      x: targetX, y: targetY, zoom: overviewZoom,
      duration: 1.4,
      ease: 'power3.inOut',
      onUpdate: () => applyTransform(),
    });

    setActiveNodeId(null);
  }, [applyTransform]);

  return (
    <CameraContext.Provider
      value={{
        cameraRef, containerRef,
        activeNodeId, setActiveNodeId,
        navigateToNode, navigateToOverview,
        applyTransform,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
}
