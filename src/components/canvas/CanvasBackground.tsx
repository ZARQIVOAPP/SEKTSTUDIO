'use client';

import { useEffect, useRef } from 'react';

interface CanvasBackgroundProps {
  cameraRef: React.MutableRefObject<{ x: number; y: number; zoom: number }>;
}

export function CanvasBackground({ cameraRef }: CanvasBackgroundProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    const loop = () => {
      if (bgRef.current && cameraRef.current) {
        const { x, y } = cameraRef.current;
        const factor = 0.05;
        bgRef.current.style.backgroundPosition = `${x * factor}px ${y * factor}px`;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [cameraRef]);

  return (
    <>
      {/* Dot grid with parallax */}
      <div
        ref={bgRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Radial vignette */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </>
  );
}
