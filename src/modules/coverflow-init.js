import { createCoverflow } from '../coverflow.js';

export function initCoverflow() {
  const el = document.querySelector('#CoverFlow');
  if (!el) return;

  const isSP = window.innerWidth < 768;

  createCoverflow(el, {
    startIndex: 2,
    getSpacing: () => (window.innerWidth < 768 ? 90 : 140),
    angle: 40,
    getScale: () => (window.innerWidth < 768 ? 0.75 : 1.2),
    getCenterScale: () => (window.innerWidth < 768 ? 1.1 : 1.5),
  });
}
