import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  // GitHub Pages project sites live at https://<user>.github.io/<repo>/
  base: process.env.BASE_PATH || '/',
  plugins: [
    tailwindcss(),
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
}));
