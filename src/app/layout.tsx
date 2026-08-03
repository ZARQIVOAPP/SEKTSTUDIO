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
  title: 'SEKT STUDIO — Multidisciplinary Creative Collective',
  description: 'SEKT STUDIO is a multidisciplinary creative collective engineering the intersection of design, film, music, art, and culture. We do not make content. We make artifacts.',
  keywords: ['creative studio', 'design', 'film', 'music', 'art direction', 'brand identity', 'motion design'],
  authors: [{ name: 'SEKT STUDIO' }],
  openGraph: {
    title: 'SEKT STUDIO — Multidisciplinary Creative Collective',
    description: 'Engineering the intersection of design, film, music, art, and culture.',
    type: 'website',
    locale: 'en_US',
    siteName: 'SEKT STUDIO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEKT STUDIO',
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
