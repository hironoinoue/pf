import './reset.scss';
import './updates.scss';
import { initUpdates } from './modules/updates.js';
import config from './config.js';

const mode = document.body.dataset.mode || 'archive';

initUpdates(config, mode);
