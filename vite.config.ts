import { pwaPlugin,developmentPwaRecovery } from './build/pwa.mjs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
 base: '/voitivaiti/',
 plugins: [react(),pwaPlugin(),developmentPwaRecovery()],
 build: {
  rollupOptions: {
   output: {
    manualChunks(id) {
     const path=id.replaceAll('\\','/');
     if (path.includes('node_modules')) return 'vendor';
     // Static content and its translation registry stay together. Contextual
     // dialogue uses the simulation at runtime and belongs with application code.
     if (path.includes('/src/content/')&&!path.endsWith('/contextDialogue.ts')) return 'game-content';
    },
   },
  },
 },
});
