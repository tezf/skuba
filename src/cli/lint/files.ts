import { globSync } from 'fast-glob';

import { log } from '../../utils/logging';

export const getFiles = (globPatterns: string[]): string[] => {
  const files = globSync(globPatterns);

  if (globPatterns.length && !files.length) {
    const error = `No files matching the patterns were found: ${globPatterns.join(
      ', ',
    )}`;
    log.err(error);
    process.exit(1);
  }

  return files;
};
