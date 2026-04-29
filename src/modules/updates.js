let dataCache = [];

export function initUpdates(config, mode) {
  const updatesEl = document.getElementById('update');
  if (!updatesEl) return;

  // 初回データ取得
  async function getUpdates() {
    try {
      const res = await fetch(config.apiUrl, {
        headers: {
          'X-MICROCMS-API-KEY': config.apiKey,
        },
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();

      dataCache = data.contents || [];
      renderUpdates();
    } catch (error) {
      console.error('Error fetching posts:', error);
      updatesEl.innerHTML = '<p>データの取得に失敗しました</p>';
    }
  }

  // 描画処理
  function renderUpdates() {
    const limit =
      mode === 'top' ? (window.innerWidth <= 768 ? 3 : 6) : dataCache.length;

    updatesEl.innerHTML = dataCache
      .slice(0, limit)
      .map((item) => {
        return `
        <li class="updates-info-item">
        <a href="/article.html?id=${item.id}">  
        <img src="${item.image?.url ?? ''}" alt="${item.title}">
            <h4 class="updates-title">${item.title}</h4>
            <p class="updates-desc">${item.description || ''}</p>
           </a>
        </li>
      `;
      })
      .join('');
  }

  // 初回実行
  getUpdates();

  // リサイズ対応（再描画）
  window.addEventListener('resize', () => {
    if (!dataCache.length) return;
    renderUpdates();
  });
}
