module.exports = {
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.spec.json',
        },
    },
    transform: {
        '^.+\\.jsx$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
