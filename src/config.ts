import { join as joinPaths, dirname } from  'path';
import { existsSync, readFileSync } from 'fs';
import { loadAll } from 'js-yaml';

export const configFilename = 'autotestgpt.config.yaml';

type ConfigExample = {
  name: string;
  code: string;
  tests: string;
}

type Configs = Array<{
  [ext: string]: Config
}>

export type Config = {
  techstack: Array<string>;
  context: string;
  examples: Array<ConfigExample>;
}

export const findConfigFile = () => {
  let currentDir = process.cwd();
  let configFilepath = null;
  
  while (currentDir !== '/') {
    const potentialConfigFilePath = joinPaths(currentDir, configFilename);
    
    if (existsSync(potentialConfigFilePath)) {
      configFilepath = potentialConfigFilePath;

      return configFilepath;
    }
    
    // Move up one directory level
    currentDir = dirname(currentDir);
  }
  
  return null;
}

export const validateConfig = (config: Array<unknown>, configLocation: string): Configs => {

  if (!Array.isArray(config)) {
    throw new Error(`Invalid config. See README.`);
  }

  if (config.some(c => typeof c !== 'object' || c === null || c === undefined)) {
    throw new Error(`Invalid config. See README.`);
  }

  const filteredConfig = config.filter(e => e);

  filteredConfig.forEach(c => {
    const values = Object.values(c as object)[0]

    if (typeof values !== 'object') {
      throw new Error(`Invalid config. See README.`);
    }

    // validate techstack, context and examples properties or fallback to defaults
    if (!values.techstack || !Array.isArray(values.techstack)) {
      values.techstack = [];
    }

    if (!values.context || typeof values.context !== 'string') {
      values.context = '';
    }

    if (!values.examples || !Array.isArray(values.examples)) {
      values.examples = [];
    }

    // validate examples and that the files exists
    values.examples.forEach((e: ConfigExample) => {
      // validate name
      if (!e.name || typeof e.name !== 'string') {
        e.name = '';
      }

      // validate code
      if (!e.code || typeof e.code !== 'string') {
        e.code = '';
      }

      // validate tests
      if (!e.tests || typeof e.tests !== 'string') {
        e.tests = '';
      }

      // validate files exists
      const codeFilepath = existsSync(joinPaths(dirname(configLocation), e.code));
      const testsFilepath = existsSync(joinPaths(dirname(configLocation), e.tests));
      
      if (!codeFilepath || !testsFilepath) {
        throw new Error(`Unable to find code or tests file for example ${e.name}, check paths in config.`);
      }
    });

  });

  return filteredConfig as Configs;
}

export const loadConfig = () => {
  // load config file
  const configFilepath = findConfigFile();

  if (!configFilepath) {
    throw new Error(`Unable to find config file (${configFilename}). See README.`);
  }

  const config = loadAll(readFileSync(configFilepath!, 'utf8'));

  return {
    path: configFilepath,
    config: validateConfig(config, configFilepath)
  };
}
