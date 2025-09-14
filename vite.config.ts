import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
    server: {
        host: true,
        port: 3000
    },
    base: process.env.NODE_ENV === 'production' ? '/youtube-player/' : './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets'
    }
});
