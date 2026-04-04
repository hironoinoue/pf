import './style.scss';
import { initTree } from './three/scene.js';
import { renderWorkd } from './components/works.js';

const fetchWorks = async () => {
  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('API取得失敗');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('fetchWorksエラー', err);
    return { contents: [] };
  }
};

const init = async () => {
  initThree();

  const data = await fetchWorks();

  renderWorks(data);
};

init();
