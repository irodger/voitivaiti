import { pwaPlugin } from './build/pwa.mjs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({ base: '/voitivaiti/', plugins: [react(),pwaPlugin()], build: { rollupOptions: { output: { manualChunks(id) { if (id.includes('node_modules')) return 'vendor'; } } } } });
