import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.flickpredict.com',
        changeOrigin: true,
        secure: false, // only needed if target uses self-signed SSL certs
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
