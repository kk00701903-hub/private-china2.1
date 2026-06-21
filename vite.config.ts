import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  // GitHub Pages project sites live at https://<user>.github.io/<repo>/
  base: process.env.BASE_PATH || '/',
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'logo.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: '中文 暗记 - 중국어 단어 암기',
        short_name: '中文暗记',
        description: '고2 1학기 4·5·6장 중국어 단어 암기',
        theme_color: '#0891b2',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ko',
        categories: ['education'],
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: 'index.html',
      },
      devOptions: {
        enabled: true,
      },
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
}));
