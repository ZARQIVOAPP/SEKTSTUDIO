'use client';

import { useState } from 'react';
import { Providers } from '@/components/Providers';
import { Loader } from '@/components/sections/Loader';
import { CanvasWorld } from '@/components/canvas/CanvasWorld';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Providers>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
      {isLoaded && <CanvasWorld />}
    </Providers>
  );
}
