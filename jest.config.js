'use strict';

/** @type {import('jest').Config} */
module.exports = {
  // Run tests in a Node.js environment (no browser APIs)
  testEnvironment: 'node',

  // Discover test files in __tests__ directories or files ending with .test.js / .spec.js
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],

  // Paths to ignore when scanning for tests
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Collect coverage from all source files, not just those imported by tests
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',          // entry-point bootstrap — excluded from coverage
    '!src/database/migrations/**',
    '!src/database/seeds/**',
  ],

  // Coverage thresholds — CI will fail if any drop below these values
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Output formats
  coverageReporters: ['text', 'lcov', 'html'],

  // Module name aliases — mirrors the import/resolver paths in .eslintrc.js
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@schemas/(.*)$': '<rootDir>/src/schemas/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
  },

  // Clear mocks between every test to prevent state leakage
  clearMocks: true,
  restoreMocks: true,

  // Display verbose per-test output in CI
  verbose: true,

  // Abort test suite after this many failures to keep CI fast
  bail: 5,
};
