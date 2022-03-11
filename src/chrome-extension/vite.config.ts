import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
const svgLoader = require('vite-plugin-react-svg');
const path = require('path');
require('dotenv-flow').config();

const cwd = path.resolve(process.cwd(), '../../');
const host = process.env.VITE_SERVER_DOMAIN.replace(/https?:\/\//, '');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths({
            loose: true,
        }),
        react(),
        svgLoader(),
    ],
    define: {
        'process.env.MONO': process.env.MONO,
    },
    resolve: {
        alias: {
            '@payem/forms': `${cwd}/packages/web-forms/src`,
            '@payem/tables': `${cwd}/packages/web-tables/src`,
            '@payem/details': `${cwd}/packages/web-details/src`,
            '@payem/devtools': `${cwd}/packages/web-devtools/src`,
            '@payem/router': `${cwd}/packages/web-router/src`,
            '@payem/ui': `${cwd}/packages/web-ui/src`,
            '@payem/base-ui': `${cwd}/packages/web-base-ui/src`,
            '@payem/testing-base': `${cwd}/packages/web-testing-base/src`,
            '@payem/hooks': `${cwd}/packages/hooks/src`,
            '@payem/root-types': `${cwd}/packages/root-types/src`,
            '@payem/themes': `${cwd}/packages/web-themes/src`,
            '@minimal/widgets': `${cwd}/packages/minimal`,
            '@payem/platformer': `${cwd}/packages/platformer`,
            '@payem/app-home': `${cwd}/apps/home`,
        },
    },
    server: {
        host,
        port: 3001,
    },
});
