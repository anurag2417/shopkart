import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins exactly once
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Global defaults - tweak timings globally
gsap.defaults({ ease: 'power3.out', duration: 0.8 });

export { gsap, ScrollTrigger, useGSAP };
