'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Providers } from '@/components/Providers';
import { Loader } from '@/components/sections/Loader';
import { CanvasWorld } from '@/components/canvas/CanvasWorld';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Providers isLoaded={isLoaded}>
      <CanvasWorld />
      {/* AnimatePresence lets the Loader play exit animations before unmounting */}
      <AnimatePresence>
        {!isLoaded && <Loader key="loader" onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>
    </Providers>
  );
}
