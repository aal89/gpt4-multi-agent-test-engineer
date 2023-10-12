import { getTotals } from './openai'
import agents from './agents/agents';
import { readFileSync } from 'fs'
import chalk from 'chalk'
import { join as joinPaths, parse } from  'path';
import { existsSync, writeFileSync } from 'fs';
import { loadConfig } from './config';
import { program } from './program';

const log = (message: string) => console.log(chalk.bold(chalk.green(message)));
const loggrey = (message: string) => console.log(chalk.bold(chalk.grey(message)));
const logblue = (message: string) => console.log(chalk.bold(chalk.blue(message)));
export const error = (message: string) => console.log(chalk.bold(chalk.red(message)));

(async () => {
  try {
    const userFile = program.args[0];

    // load config file
    const { path, config } = loadConfig();
    logblue(`Using config file found at ${path}`);

    // write file argument out to console from commander
    const userFilePath = joinPaths(process.cwd(), userFile);
    const parsedUserFilePath = parse(userFilePath);
    const newFileName = parsedUserFilePath.name + '.test' + parsedUserFilePath.ext;
    const newFileNamePath = joinPaths(parsedUserFilePath.dir, newFileName);
    const [configForExtension] = config.map(c => c[parsedUserFilePath.ext]);

    if (!configForExtension) {
      throw new Error(`No config found for extension ${parsedUserFilePath.ext}`);
    }

    if (!existsSync(userFilePath) || !parsedUserFilePath.ext) {
      throw new Error(`File ${userFilePath} does not exist or unknown file extension`);
    }

    logblue(`Generating ${newFileNamePath}`);

    const fileContents = readFileSync(userFilePath, 'utf8');
    
    // Make the agents work together and generate the tests
    let output: string | null = null;

    output = await agents.tester.build(fileContents, configForExtension);

    if (!output) {
      throw new Error('No output from tester agent. Change config and try again.');
    }
  
    // Let the lead review and optionally refactor the built tests.
    output = await agents.lead.build(output, configForExtension);

    if (!output) {
      throw new Error('No output from lead agent. Change config and try again.');
    }

    // write the output to the file
    log(`Done!`);
    // remove first and last line from output
    const cleanOutput = output.split('\n').slice(1, -1).join('\n');
    writeFileSync(newFileNamePath, cleanOutput, 'utf8')
  
    // Calculate the cost of the conversation and output the results
    const { cost, tokens } = getTotals();
    loggrey(`Total tokens used (io): ${tokens}`);
    loggrey(`Total cost $${cost}`);
  } catch (err) {
    error((err as Error).message);
  }
})();
