import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        article: 'article.html',
        updates: 'updates.html',
      },
    },
  },
});
