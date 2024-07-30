import path from 'path';
import { isMainThread } from 'worker_threads';

import chalk from 'chalk';

import { createLogger } from '../../utils/logging.js';
import { execWorkerThread, postWorkerOutput } from '../../utils/worker.js';
import { type ESLintOutput, runESLint } from '../adapter/eslint.js';

import type { Input } from './types.js';

const LOG_PREFIX = chalk.magenta('ESLint   │');

export const runESLintInCurrentThread = ({ debug }: Input) =>
  runESLint('lint', createLogger(debug, LOG_PREFIX));

export const runESLintInWorkerThread = (input: Input) =>
  execWorkerThread<Input, ESLintOutput>(
    path.posix.join(import.meta.dirname, 'eslint.js'),
    input,
  );

if (!isMainThread) {
  postWorkerOutput(runESLintInCurrentThread, createLogger(false, LOG_PREFIX));
}
