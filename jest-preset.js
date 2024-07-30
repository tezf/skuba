import presets from 'ts-jest/presets/index.js';

import { createModuleNameMapper } from './jest/moduleNameMapper.js';
import { transform } from './jest/transform.js';

/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  ...presets.defaults,

  moduleNameMapper: createModuleNameMapper(),
  transform,

  collectCoverageFrom: [
    '**/*.ts',
    '**/*.tsx',
    '!**/node_modules*/**',
    '!<rootDir>/coverage*/**',
    '!<rootDir>/dist*/**',
    '!<rootDir>/lib*/**',
    '!<rootDir>/tmp*/**',
    '!<rootDir>/jest.*.ts',
  ],
  coverageDirectory: 'coverage',
  // jestjs/jest#14305
  prettierPath: null,
  reporters: [
    'default',
    import.meta.resolve('./lib/cli/test/reporters/github'),
    import.meta.resolve('./lib/cli/test/reporters/prettier'),
  ],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules.*/',
    '<rootDir>/(coverage|dist|lib|tmp).*/',
  ],
  watchPlugins: [
    import.meta.resolve('jest-watch-typeahead/filename'),
    import.meta.resolve('jest-watch-typeahead/testname'),
  ],
};
