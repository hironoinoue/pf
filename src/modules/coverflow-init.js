import { createCoverflow } from '../coverflow.js';

export function initCoverflow() {
  const el = document.querySelector('#CoverFlow');
  if (!el) return;

  const isSP = window.innerWidth < 768;

  createCoverflow(el, {
    startIndex: 2,
    spacing: isSP ? 90 : 140,
    angle: 40,
    scale: isSP ? 0.75 : 1.2,
    centerScale: isSP ? 1.1 : 1.5,
  });
}
