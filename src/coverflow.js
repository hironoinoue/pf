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

  const spacing = options.spacing ?? 240;
  const angle = options.angle ?? 40;
  const scale = options.scale ?? 1.2;
  const centerScale = options.centerScale ?? 1.5;

  // -----------------------------
  // 描画
  // -----------------------------
  function render() {
    const isSP = window.innerWidth < 768;

    items.forEach((item, i) => {
      const offset = i - current;

      const distanceFactor = offset === 0 ? 1 : 1 + Math.abs(offset) * 0.15; //0.1

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

      const { title, tool } = currentItem.dataset;

      titleEl.innerHTML = `
      <div class="title"> ${title}</div>
      <small class="tools">Tools： ${tool}</small>
      `;
    }
  }

  // -----------------------------
  // click
  // -----------------------------
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
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

  // 初期描画
  render();
}
