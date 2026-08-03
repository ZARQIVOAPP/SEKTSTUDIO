'use client';

import { useState } from 'react';
import { Providers } from '@/components/Providers';
import { Loader } from '@/components/sections/Loader';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Works } from '@/components/sections/Works';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { Journal } from '@/components/sections/Journal';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Providers>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}

      <main>
        <Hero loaded={isLoaded} />
        <About />
        <Works />
        <Services />
        <Process />
        <Journal />
        <Contact />
      </main>

      <Footer />
    </Providers>
  );
}
