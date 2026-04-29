export function initMenu() {
  const btn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.global-nav');
  const overlay = document.querySelector('.overlay');

  if (!btn || !nav || !overlay) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('active');
    btn.classList.toggle('active');
    overlay.classList.remove('active');
  });
}
