import './style.scss';
import config from './config.js';

// Three.js の初期化は別で使う場合だけ有効
// import { initTree } from './three/scene.js';
// import { renderWorkd } from './components/works.js';

async function getWorks() {
  try {
    // const res = await fetch('/api/posts');
    const res = await fetch(config.apiUrl, {
      headers: {
        'X-MICROCMS-API-KEY': config.apiKey,
      },
    });
    const data = await res.json();

    console.log(data.contents);

    const worksEl = document.getElementById('work');
    worksEl.innerHTML = data.contents
      .map(
        (item) => `
        <div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <a href="${item.link}" target="_blank">見る</a>
        </div>
      `,
      )
      .join('');
  } catch (error) {
    console.error('Error fetching posts:', error);
    const worksEl = document.getElementById('work');
    worksEl.innerHTML = '<p>データの取得に失敗しました</p>';
  }
}

getWorks();
