// vite.config.ts (or vite.config.js with ESM)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// set via env when ngrok rotates
// const NGROK_HOST = '38173443f296.ngrok-free.app'; // frontend
const NGROK_HOST = 'zoggybet.com'; // frontend
// const NGROK_HOST = '56b68f8b0cd2.ngrok-free.app'; // backend
// change if your backend runs elsewhere in dev
// const BACKEND = 'http://localhost:8080';
const BACKEND = 'https://api.zoggybet.com';

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 8000,
    strictPort: true,

    // allow your current tunnel + any *.ngrok-free.app
    allowedHosts: [NGROK_HOST, /\.ngrok-free\.app$/],

    // HMR over WSS behind HTTPS tunnel
    hmr: {
      host: NGROK_HOST,
      protocol: 'wss',
      clientPort: 443,
      overlay: false,
    },

    // absolute asset URLs/HMR point to your public dev origin
    origin: `https://${NGROK_HOST}`,

    // Dev-only CSP so the Telegram widget + HMR work
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://t.me https://telegram.org",
        // include your dev origin for HMR (https + wss), Telegram endpoints, and any ngrok host
        `connect-src 'self' https://${NGROK_HOST} wss://${NGROK_HOST} https://api.telegram.org https://t.me https://oauth.telegram.org https://*.ngrok-free.app`,
        // needed for data-onauth="window.__onTelegramAuth(user)" in dev
        "script-src 'self' https://telegram.org 'unsafe-eval' 'unsafe-inline'",
        // OAuth/login frame & t.me
        "frame-src https://t.me https://telegram.org https://oauth.telegram.org",
      ].join('; ')
    },

    // Proxy /api calls to Express (no mixed content/CORS in the browser)
    proxy: {
      '/api': {
        target: BACKEND,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
