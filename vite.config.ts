import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves the site under /<repository-name>/.
  base: '/whatsapp-link-generator/',
  plugins: [react()],
});
