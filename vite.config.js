import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { externals } from 'shared-base';
import analyze from 'rollup-plugin-analyzer';
import p from './package.json';

export default defineConfig({
    plugins: [dts({})],
    build: {
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'ReduxConnected',
            formats: ['es', 'umd'],
            fileName: (format) => `redux-connected.${format}.js`,
        },
        rollupOptions: {
            plugins: [analyze()],
            ...externals({
                react: '',
                ...p.dependencies,
                '@firebase/auth': '',
                '@firebase/logger': '',
                '@firebase/analytics': '',
                '@firebase/storage': '',
                '@firebase/installations': '',
                '@firebase/firestore': '',
                '@firebase/firestore/lite': '',
                '@firebase/app': '',
                'react/jsx-runtime': '',
            }),
        },
    },
});
