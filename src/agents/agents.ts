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
    const exampleCodePath = joinPaths(baseDir, example.code);
    const exampleTestsPath = joinPaths(baseDir, example.tests);

    // if the files don't exist, return empty string
    if (!existsSync(exampleCodePath) || !existsSync(exampleTestsPath)) {
      error(`Example files ${example.code} or ${example.tests} do not exist. Check config.`);
      return '';
    }

    const code = readFileSync(exampleCodePath, 'utf8');
    const tests = readFileSync(exampleTestsPath, 'utf8');

    return encapsulateWithBackTicks(code, 'example-code') + '\n' + encapsulateWithBackTicks(tests, 'example-tests');
  }).join('\n\n');
}

export default {
  ...tester,
  ...leadAgent,
} as AgentMap;
