import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/esm/'],
    testMatch: ['**/*.spec.ts'],
    testTimeout: 30000,
};

export default config;
