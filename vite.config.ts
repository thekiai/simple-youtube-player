import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
    server: {
        host: true,
        port: 3001
    },
    base: mode === 'production' ? '/simple-youtube-player/' : '/',
    build: {
        outDir: 'dist',
    },
    preview: {
        port: 4173,
        host: true
    }
}));
