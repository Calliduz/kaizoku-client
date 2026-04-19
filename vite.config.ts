import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Forward all headers INCLUDING Range (required for hls.js segment streaming)
        // Without this, Vite strips headers and the backend returns 200 instead of 206,
        // causing hls.js to stall indefinitely on the first .ts segment.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Explicitly forward Range header for HLS segment requests
            if (req.headers['range']) {
              proxyReq.setHeader('range', req.headers['range']);
            }
          });
        },
      },
    },
  },
});
