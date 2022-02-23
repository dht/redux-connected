import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    dedupe: ['react', 'react-dom'],
    css: {
        preprocessorOptions: {
            rootpath: 'http://localhost:3508/src',
        },
    },
    plugins: [
        reactRefresh(),
        tsconfigPaths({
            loose: true,
        }),
    ],
    server: {
        port: 3508,
        // host: '172.27.251.37',
    },
});
