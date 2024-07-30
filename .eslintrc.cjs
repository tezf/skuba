const ts = ['ts', 'cts', 'mts', 'tsx'];

module.exports = {
  extends: ['skuba'],
  overrides: [
    {
      files: [`integration/**/*.{${ts}}`],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // seek-oss/eslint-config-seek#124
        // typescript-eslint/typescript-eslint#3851
        allowAutomaticSingleRunInference: false,
      },
    },
    {
      files: [`src/**/*.{${ts}}`],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'fs',
                message:
                  'Prefer fs-extra as it implements graceful-fs behaviour.',
              },
            ],
          },
        ],
      },
    },
  ],
  rules: {
    // internal to skuba itself
    'no-process-exit': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',

        extensionAlias: {
          '.js': ['.ts', '.d.ts', '.js'],
        },
      },
    },
  },
};
