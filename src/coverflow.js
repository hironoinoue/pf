export function createCoverflow(container, options = {}) {
  const wrapper = container.closest('.coverflow-wrapper');
  const items = container.querySelectorAll('.coverflow__item');

  const prevBtn = wrapper.querySelector('.coverflow__btn--prev');
  const nextBtn = wrapper.querySelector('.coverflow__btn--next');
  const titleEl = wrapper.querySelector('#albumTitle');

  let current = options.startIndex ?? 0;

  let startX = 0;
  let isDragging = false;
  let diff = 0;

  const angle = options.angle ?? 40;

  // -----------------------------
  // 描画
  // -----------------------------
  function render() {
    const isSP = window.innerWidth < 768;

    const spacing = options.getSpacing ? options.getSpacing() : 240;
    const scale = options.getScale ? options.getScale() : 1.2;
    const centerScale = options.getCenterScale ? options.getCenterScale() : 1.5;

    items.forEach((item, i) => {
      const offset = i - current;

      const distanceFactor = offset === 0 ? 1 : 1 + Math.abs(offset) * 0.15;

      const x = offset * spacing * distanceFactor + diff;

      const rotate = offset === 0 ? 0 : offset < 0 ? angle : -angle;

      const itemScale = offset === 0 ? (isSP ? 1.1 : centerScale) : scale;

      item.style.transform = `
        translateX(${x}px)
        rotateY(${rotate}deg)
        scale(${itemScale})
      `;

      item.style.zIndex = offset === 0 ? 999 : 100 - Math.abs(offset);
      item.style.opacity = offset === 0 ? 1 : 0.6;
    });

    if (titleEl) {
      const currentItem = items[current];

      const { title, tool, link } = currentItem.dataset;

      titleEl.innerHTML = `
      <div class="title"> ${title}</div>
      <div class="tools"> Made with ${tool}</div>
      <a href="${link}" target="_blank" rel="noopener noreferrer">View →</a>

      `;
    }
  }

  // -----------------------------
  // click
  // -----------------------------
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (i === current) return;

      current = i;
      diff = 0;
      render();
    });
  });

  prevBtn?.addEventListener('click', () => {
    current = (current - 1 + items.length) % items.length;
    diff = 0;
    render();
  });

  nextBtn?.addEventListener('click', () => {
    current = (current + 1) % items.length;
    diff = 0;
    render();
  });

  // -----------------------------
  // touch
  // -----------------------------
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;

    items.forEach((item) => {
      item.style.transition = 'none';
    });
  });

  container.addEventListener(
    'touchmove',
    (e) => {
      if (!isDragging) return;

      e.preventDefault();

      const moveX = e.touches[0].clientX;
      diff = moveX - startX;

      render();
    },
    { passive: false },
  );

  container.addEventListener('touchend', (e) => {
    if (!isDragging) return;

    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const velocity = endX - startX;

    if (velocity > 50) {
      current = (current - 1 + items.length) % items.length;
    } else if (velocity < -50) {
      current = (current + 1) % items.length;
    }

    diff = 0;

    items.forEach((item) => {
      item.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
    });

    render();
  });

  //リサイズした0.15秒後に１回だけrender
  let resizeTimer;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      diff = 0;
      render();
    }, 150);
  });

  // 初期描画
  render();
}
