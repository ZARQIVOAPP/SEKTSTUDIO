import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Custom ease definitions
gsap.config({
  nullTargetWarn: false,
});

// Custom bezier easings  
const EASINGS = {
  outExpo: 'power4.out',
  outQuart: 'power3.out', 
  inOutExpo: 'expo.inOut',
  smooth: 'power2.out',
} as const;

export { gsap, ScrollTrigger, EASINGS };
