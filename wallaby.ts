const path = require('path');

module.exports = function (wallaby) {
    process.env.NODE_PATH +=
        path.delimiter + path.join(wallaby.projectCacheDir, 'packages');

    return {
        autoDetect: true,
        files: [
            {
                pattern: '**/*.spec.ts',
                ignore: true,
            },
            {
                pattern: '**/esm/**',
                ignore: true,
            },
            {
                pattern: '**/lib/**',
                ignore: true,
            },
            {
                pattern: '**/node_modules/**',
                ignore: true,
            },
            {
                pattern: '**/ios/**',
                ignore: true,
            },
            {
                pattern: '**/android/**',
                ignore: true,
            },
            {
                pattern: 'adapter-base/**/*.ts',
            },
            {
                pattern: 'adapter/**/*.ts',
            },
            {
                pattern: 'adapters-vendors/**/*.ts',
            },
            {
                pattern: 'connectors/**/*.ts',
            },
            {
                pattern: 'db-tools/**/*.ts',
            },
            {
                pattern: 'examples/**/*.ts',
            },
            {
                pattern: 'packages/**/*.ts',
            },
        ],
        tests: [
            {
                pattern: 'adapters-vendors/**/*.spec.ts',
            },
        ],
        testFramework: 'jest',
        env: {
            type: 'node',
        },
        loose: true,
        delay: {
            run: 1000,
        },
        filesWithNoCoverageCalculated: ['**/node_modules/**'],
        debug: true,
    };
};
