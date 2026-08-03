'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme';
import { CameraProvider } from '@/lib/camera';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Navigation } from '@/components/ui/Navigation';
import { MusicPlayer } from '@/components/ui/MusicPlayer';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <CameraProvider>
        <CustomCursor />
        <Navigation />
        <MusicPlayer />
        {children}
      </CameraProvider>
    </ThemeProvider>
  );
}
