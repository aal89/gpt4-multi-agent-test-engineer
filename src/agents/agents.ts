import tester from "./tester";
import leadAgent from "./lead";
import { AgentMap } from "./types";
import { Config, findConfigFile } from "../config";
import { join as joinPaths, dirname } from  'path';
import { existsSync, readFileSync } from 'fs';
import { error } from "..";

export const encapsulateWithBackTicks = (str: string, type?: string) => {
  // if code is already encapsulated skip it
  if (str.startsWith('```') && str.endsWith('```')) {
    return str;
  }

  return '```' + (type ? type : '') +  '\n' + str + '\n```';
}

export const generateExamplesFromConfig = (config: Config) => {
  const configDir = findConfigFile();

  if (!configDir) {
    return '';
  }

  const baseDir = dirname(configDir);

  return config.examples.map(example => {
    // if the files don't exist, return empty string
    if (!existsSync(joinPaths(baseDir, example.code)) || !existsSync(joinPaths(baseDir, example.tests))) {
      error(`Example files ${example.code} or ${example.tests} do not exist. Check config.`);
      return '';
    }

    const code = readFileSync(joinPaths(baseDir, example.code), 'utf8');
    const tests = readFileSync(joinPaths(baseDir, example.tests), 'utf8');

    return encapsulateWithBackTicks(code, 'example-code') + '\n' + encapsulateWithBackTicks(tests, 'example-tests');
  }).join('\n\n');
}

export default {
  ...tester,
  ...leadAgent,
} as AgentMap;
