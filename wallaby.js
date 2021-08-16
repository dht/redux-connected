const path = require('path');

module.exports = function (wallaby) {
    process.env.NODE_PATH +=
        path.delimiter + path.join(wallaby.projectCacheDir, 'packages');

    return {
        files: [
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
                pattern: 'packages/**/*.spec.ts',
                ignore: true,
            },
        ],
        tests: [
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
