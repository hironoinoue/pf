import './reset.scss';
import './style.scss';
import './coverflow.scss';
import './scroll.js';
import config from './config.js';
import { createCoverflow } from './coverflow.js';

import { initUpdates } from './modules/updates.js';
import { initMenu } from './modules/menu.js';
import { initCoverflow } from './modules/coverflow-init.js';
import { initLoading } from './modules/loading.js';
import { initScene, destroyScene } from './modules/scene.js';

const page = document.body.dataset.page;

initPage(page);

function initPage(page) {
  const pages = {
    top: initTopPage,
    updates: initUpdatesPage,
  };
  pages[page]?.();
}

function initTopPage() {
  initScene();
  initCoverflow();
  initMenu();
  initLoading();

  initUpdates(config, 'top');
}

function initUpdatesPage() {
  destroyScene();
  initUpdates(config, 'all');
}
