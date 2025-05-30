import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/auth': 'http://localhost:3001'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});