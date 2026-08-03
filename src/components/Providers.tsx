'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme';
import { SmoothScrollProvider } from '@/lib/smooth-scroll';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Navigation } from '@/components/ui/Navigation';
import { MusicPlayer } from '@/components/ui/MusicPlayer';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <CustomCursor />
        <Navigation />
        <MusicPlayer />
        {children}
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
