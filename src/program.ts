import env from "./env";
import packageJson from '../package.json';
import chalk from "chalk";
import { Command } from "commander";

export const program = new Command(); // Create a Commander program

program
  .name(chalk.bold(packageJson.name))
  .description(chalk.bold(packageJson.description))
  .version(packageJson.version);

// Define options for your CLI
program
  .argument('<file>', 'Specify the file to write tests for')
  .requiredOption('--api-key <key>', 'Specify the OpenAI API key', env.OPENAI_API_KEY)
  .parse(process.argv);