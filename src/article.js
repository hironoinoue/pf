import config from './config.js';
import './article.scss';
import './reset.scss';

const articleEl = document.getElementById('article');

if (!articleEl) {
  console.error('article element not found');
} else {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  if (!id) {
    articleEl.innerHTML = '<p>記事が見つかりません</p>';
  } else {
    getArticle(id);
  }
}

async function getArticle(id) {
  try {
    const res = await fetch(`${config.apiUrl}/${id}`, {
      headers: {
        'X-MICROCMS-API-KEY': config.apiKey,
      },
    });

    if (!res.ok) throw new Error('API Error');

    const data = await res.json();
    renderArticle(data);
  } catch (error) {
    console.error(error);
    articleEl.innerHTML = '<p>データの取得に失敗しました</p>';
  }
}

function renderArticle(data) {
  articleEl.innerHTML = `

    <h1 class="article-title">${data.title}</h1>

    ${
      data.image?.url
        ? `<img class="article-img" src="${data.image.url}" alt="${data.title}">`
        : ''
    }

    ${
      data.link
        ? `<a class="article-link" href="${data.link}" target="_blank" rel="noopener">LiveDemo →</a>`
        : ''
    }

    <div class="article-body">
      ${data.article || ''}
    </div>
    <div class="article-meta">
      <time>${formatDate(data.publishedAt)}</time>
    </div>

    
  `;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ja-JP');
}
