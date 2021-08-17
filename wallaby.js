const path = require('path');

module.exports = function (wallaby) {
    process.env.NODE_PATH +=
        path.delimiter + path.join(wallaby.projectCacheDir, 'packages');

    return {
        files: [
            {
                pattern: 'adapters/**/*.ts',
            },
            {
                pattern: 'connectors/**/*.ts',
            },
            {
                pattern: 'examples/**/*.ts',
            },
            {
                pattern: 'packages/**/*.ts',
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
                pattern: 'adapters/**/*.spec.ts',
                ignore: true,
            },
            {
                pattern: 'connectors/**/*.spec.ts',
                ignore: true,
            },
            {
                pattern: 'examples/**/*.spec.ts',
                ignore: true,
            },
            {
                pattern: 'packages/**/*.spec.ts',
                ignore: true,
            },
        ],
        tests: [
            {
                pattern: 'adapters/**/*.spec.ts',
            },
            {
                pattern: 'connectors/**/*.spec.ts',
            },
            {
                pattern: 'examples/**/*.spec.ts',
            },
            {
                pattern: 'packages/**/*.spec.ts',
            },
            {
                pattern: '**/node_modules/**',
                ignore: true,
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
