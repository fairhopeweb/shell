/* eslint-disable */
export default {
  displayName: 'ui',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coveragePathIgnorePatterns: ['/libs/utilities'],
  coverageDirectory: '../../coverage/libs/ui',
  coverageThreshold: {
    '*/**': {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
};
