import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'SEKT STUDIOS — Multidisciplinary Creative Collective',
  description: 'SEKT STUDIOS is a multidisciplinary creative collective engineering the intersection of design, film, music, art, and culture. We do not make content. We make artifacts.',
  metadataBase: new URL('https://sekt.studio'),
  authors: [{ name: 'SEKT STUDIOS' }],
  openGraph: {
    title: 'SEKT STUDIOS — Multidisciplinary Creative Collective',
    description: 'SEKT STUDIOS is a multidisciplinary creative collective.',
    url: 'https://sekt.studio',
    siteName: 'SEKT STUDIOS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEKT STUDIOS',
    description: 'Multidisciplinary Creative Collective',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
