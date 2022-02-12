import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: [
        '<rootDir>/lib/',
        '<rootDir>/esm/',
        '<rootDir>/src/__fixtures__',
    ],
    testMatch: [
        '<rootDir>/adapters-vendors/rc-adapter-json-server/**/*.spec.ts',
    ],
    testTimeout: 30000,
};

export default config;
