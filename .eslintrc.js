'use strict';

module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'commonjs',
  },
  plugins: ['import'],
  extends: ['eslint:recommended', 'plugin:import/recommended'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  rules: {
    // ── General code quality ────────────────────────────────────────────
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-shadow': 'error',

    // ── Import hygiene ──────────────────────────────────────────────────
    // Detect circular dependencies across modules
    'import/no-cycle': ['error', { maxDepth: Infinity, ignoreExternal: true }],

    // Enforce strict module boundary direction:
    // routes → controllers → services → repositories → database
    // Nothing in a lower layer may import from a higher layer.
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            // repositories must not import from services or controllers
            target: './src/repositories',
            from: './src/services',
            message: 'Repositories must not import from services (boundary violation).',
          },
          {
            target: './src/repositories',
            from: './src/controllers',
            message: 'Repositories must not import from controllers (boundary violation).',
          },
          {
            target: './src/repositories',
            from: './src/routes',
            message: 'Repositories must not import from routes (boundary violation).',
          },
          {
            // services must not import from controllers or routes
            target: './src/services',
            from: './src/controllers',
            message: 'Services must not import from controllers (boundary violation).',
          },
          {
            target: './src/services',
            from: './src/routes',
            message: 'Services must not import from routes (boundary violation).',
          },
          {
            // controllers must not import from routes
            target: './src/controllers',
            from: './src/routes',
            message: 'Controllers must not import from routes (boundary violation).',
          },
        ],
      },
    ],

    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.js', '**/*.spec.js', 'jest.config.js'] },
    ],

    'import/no-unresolved': 'error',
  },
};
