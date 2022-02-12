import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    dedupe: ['react', 'react-dom'],
    plugins: [
        reactRefresh(),
        tsconfigPaths({
            loose: true,
        }),
    ],
    server: {
        port: 3510,
        // host: '172.27.251.37',
    },
});
