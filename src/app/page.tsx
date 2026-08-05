'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Providers } from '@/components/Providers';
import { Loader } from '@/components/sections/Loader';
import { CanvasWorld } from '@/components/canvas/CanvasWorld';
import { MaintenancePage } from '@/components/sections/MaintenancePage';

// Secret key to bypass maintenance mode
const BYPASS_KEY = 'sekt';
const BYPASS_VALUE = 'edit';
const STORAGE_KEY = 'sekt-editor';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditor, setIsEditor] = useState<boolean | null>(null); // null = checking

  // Check if visitor is the editor
  useEffect(() => {
    // Check URL param first: ?sekt=edit
    const params = new URLSearchParams(window.location.search);
    if (params.get(BYPASS_KEY) === BYPASS_VALUE) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsEditor(true);
      // Clean the URL so the key isn't visible
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // Check localStorage (persists across visits once activated)
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      setIsEditor(true);
      return;
    }

    // Regular visitor
    setIsEditor(false);
  }, []);

  // Still checking
  if (isEditor === null) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#0A0A0A' }} />
    );
  }

  // Regular visitor sees maintenance page
  if (!isEditor) {
    return <MaintenancePage />;
  }

  // Editor sees the real website
  return (
    <Providers isLoaded={isLoaded}>
      <CanvasWorld />
      <AnimatePresence>
        {!isLoaded && <Loader key="loader" onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>
    </Providers>
  );
}
