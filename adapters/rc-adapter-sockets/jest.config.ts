import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: [
        '<rootDir>/lib/',
        '<rootDir>/esm/',
        '<rootDir>/src/sagas/_testExamples',
        '<rootDir>/src/__fixtures__',
    ],
    testMatch: ['**/adapterFsDirectories.spec.ts'],
    testTimeout: 30000,
};

export default config;
