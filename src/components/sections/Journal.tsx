'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { ScrollReveal } from '../motion/ScrollReveal';

const articles = [
  { 
    id: 1, 
    title: 'The Death of the Portfolio', 
    category: 'Perspective', 
    date: 'Jul 2024', 
    excerpt: 'Why the traditional portfolio is an obsolete format, and what replaces it in an era of living, breathing creative practice.', 
    readTime: '6 min', 
    image: '/images/journal-portfolio.jpg' 
  },
  { 
    id: 2, 
    title: 'Sound as Material', 
    category: 'Process', 
    date: 'Jun 2024', 
    excerpt: 'Exploring the intersection of audio design and visual identity. How sound shapes perception and anchors brand memory.', 
    readTime: '8 min', 
    image: '/images/journal-sound.jpg' 
  },
  { 
    id: 3, 
    title: 'Against Minimalism', 
    category: 'Culture', 
    date: 'May 2024', 
    excerpt: 'Minimalism is not restraint. It is often laziness disguised as taste. A case for maximalist intention and controlled complexity.', 
    readTime: '5 min', 
    image: '/images/journal-minimalism.jpg' 
  },
];

export function Journal() {
  const [heroArticle, ...smallArticles] = articles;

  return (
    <section className="pt-16 pb-32 px-6 md:px-12 lg:px-24 bg-[var(--color-background)]">
      <ScrollReveal>
        <span className="font-mono text-sm uppercase tracking-widest text-[var(--color-text-secondary)] block mb-16 md:mb-24">
          006 — JOURNAL
        </span>
      </ScrollReveal>

      <div className="flex flex-col gap-24">
        {/* Hero Article */}
        <ScrollReveal delay={0.1}>
          <div className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 h-[50vh] md:h-[60vh] w-full overflow-hidden relative">
              <Image 
                src={heroArticle.image}
                alt={heroArticle.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover grayscale transition duration-500 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="font-mono text-xs md:text-sm text-[var(--color-text-secondary)] flex items-center gap-4 mb-8">
                <span>{heroArticle.category}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                <span>{heroArticle.date}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                <span>{heroArticle.readTime}</span>
              </div>
              <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-[var(--color-text-primary)] group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-between">
                <span>{heroArticle.title}</span>
                <motion.span 
                  className="opacity-0 -translate-x-4 hidden md:block"
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ↗
                </motion.span>
              </h3>
              <p className="text-[var(--color-text-secondary)] text-lg md:text-xl leading-relaxed max-w-xl">
                {heroArticle.excerpt}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Small Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {smallArticles.map((article, index) => (
            <ScrollReveal key={article.id} delay={0.2 + (index * 0.1)}>
              <div className="group cursor-pointer flex flex-col h-full">
                <div className="aspect-[4/3] w-full overflow-hidden relative mb-8">
                  <Image 
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale transition duration-500 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                </div>
                
                <div className="font-mono text-xs text-[var(--color-text-secondary)] flex items-center gap-4 mb-6">
                  <span>{article.category}</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                  <span>{article.date}</span>
                </div>
                
                <h4 className="font-display text-2xl md:text-3xl font-medium mb-4 text-[var(--color-text-primary)] group-hover:opacity-80 transition-opacity duration-300 flex justify-between items-center">
                  <span>{article.title}</span>
                  <motion.span 
                    className="opacity-0 -translate-x-4"
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ↗
                  </motion.span>
                </h4>
                
                <p className="text-[var(--color-text-secondary)] text-base leading-relaxed mt-auto">
                  {article.excerpt}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
