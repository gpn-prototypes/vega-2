const path = require('path');

const setupTestFile = path.resolve('setup-tests.ts');

const config = require('@gpn-prototypes/frontend-configs/jest/jest.config')({
  setupFilesAfterEnv: setupTestFile,
});

module.exports = {
  ...config,
  modulePathIgnorePatterns: [...config.modulePathIgnorePatterns, '/e2e-tests/', '/test-utils/'],
  coveragePathIgnorePatterns: [
    ...config.coveragePathIgnorePatterns,
    '/e2e-tests/',
    '/__generated__/',
    '/test-utils/',
  ],
  coverageReporters: ['lcov', 'json-summary', 'text', 'text-summary'],
  transformIgnorePatterns: ['node_modules/?!(@gpn-prototypes)/'],
  moduleNameMapper: {
    ...config.moduleNameMapper,
    '^@vega(.*)$': '<rootDir>/src$1',
  },
};
