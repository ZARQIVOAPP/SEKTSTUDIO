'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';

export function ParallaxImage({
  src,
  alt,
  width,
  height,
  speed = 0.5,
  className = '',
  containerClassName = ''
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  speed?: number;
  className?: string;
  containerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  const yAmount = `${speed * 30}%`;
  const y = useTransform(scrollYProgress, [0, 1], [`-${yAmount}`, yAmount]);
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${containerClassName}`}>
      <motion.div style={{ y }} className="w-full h-full scale-[1.3]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-cover filter grayscale contrast-110 ${className}`}
        />
      </motion.div>
    </div>
  );
}
