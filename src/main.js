// console.log('main.js loaded');
// console.log('before DOM');
import './reset.scss';
import './style.scss';
import './coverflow.scss';
import './scene.js';
import './scroll.js';
import config from './config.js';
import { createCoverflow } from './coverflow.js';

let dataCache = [];
const updatesEl = document.getElementById('update');

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

// 描画処理（ここが本体）
function renderUpdates() {
  const limit = window.innerWidth <= 768 ? 3 : 6;

  updatesEl.innerHTML = dataCache
    .slice(0, limit)
    .map((item) => {
      return `
        <li class="updates-info-item">
        ${
          item.link
            ? `<a class="updates-link" href="${item.link}" target="_blank" rel="noopener">`
            : `<div class="updates-link">`
        }
          
            <h3 class="updates-title">${item.title}</h3>
            <p class="updates-desc">${item.description || ''}</p>
            ${item.link ? `<a>` : `</div>`}
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

const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.global-nav');
const overlay = document.querySelector('.overlay');

btn.addEventListener('click', () => {
  nav.classList.toggle('active');
  btn.classList.toggle('active');
  overlay.classList.remove('active');
});

function getCoverflowOptions() {
  const isSP = window.innerWidth < 768;

  return {
    startIndex: 2, //3
    spacing: isSP ? 90 : 140, //140
    // angle: isSP ? 40 : 40,
    angle: 40,
    scale: isSP ? 0.75 : 1.2, //1.2
    centerScale: isSP ? 1.1 : 1.5,
  };
}
function init() {
  const el = document.querySelector('#CoverFlow');
  if (!el) return;

  createCoverflow(el, getCoverflowOptions());
}

// 初回
window.addEventListener('DOMContentLoaded', init);

// リサイズ
window.addEventListener('resize', init);
// function init() {
//   const el = document.querySelector('#CoverFlow');
//   if (!el) return;
//   createCoverflow(el, getCoverflowOptions());
// }
// window.addEventListener('DOMContentLoaded', () => {
//   window.addEventListener('resize', init);
// });

// window.addEventListener('DOMContentLoaded', () => {
//   console.log('DOM ready');
//   const el = document.querySelector('#CoverFlow');

//   createCoverflow(el, getCoverflowOptions());
// });

//ローディング表示
window.addEventListener('load', () => {
  const loading = document.querySelector('.loading');

  loading.classList.add('hide');

  loading.addEventListener(
    'transitioned',
    () => {
      loading.style.display = 'none';
    },
    { once: true },
  );
});
