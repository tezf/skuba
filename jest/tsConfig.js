import {
  findConfigFile,
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
} from 'typescript';

/**
 * @returns {unknown}
 */
const getTsConfigFromDisk = () => {
  const filename =
    findConfigFile('.', sys.fileExists.bind(this)) ?? 'tsconfig.json';

  return readConfigFile(filename, sys.readFile.bind(this)).config;
};

export const tryParseTsConfig = (getConfig = getTsConfigFromDisk) => {
  try {
    const json = getConfig();

    return parseJsonConfigFileContent(json, sys, '.');
  } catch {
    // Bail out here to support zero-config mode.
  }
};
