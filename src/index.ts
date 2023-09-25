import * as dotenv from 'dotenv'
dotenv.config();

import { ok } from 'assert'
import { input } from '@inquirer/prompts';
import { calculateCost } from './openai'
import agents from './agents/agents';
import { readFileSync } from 'fs'

// Check environment variables
ok(process.env.OPENAI_API_KEY);

(async () => {
  let output: string | null = null;
  // Ask for code to build tests for
  const answer = await input({ message: 'What code to write tests for? Give an absolute path to the file.' });

  const fileContents = readFileSync(answer, 'utf8');

  console.log(`Asking lead who should write the tests for the file ${answer}...`);

  // Setup conversation between the agents
  // Lead checks to whom this task should be delegated
  const isBackendCode = await agents.lead.question(`Is this a backend code: ${fileContents}. I want you to reply the word 'true' (without parenthesis) if this is backend code, 'false' otherwise.`);

  if (isBackendCode === 'true') {
    console.log('The task is assinged to the API and backend expert...');
    // Backend agent builds tests
    output = await agents.backend.build(fileContents);
  }

  if (isBackendCode === 'false') {
    console.log('The task is assinged to the specialist in UI and front-end testing...');
    // Frontend agent builds tests
    output = await agents.frontend.build(fileContents);
  }

  console.log('The lead is reviewing the built code...');
  // Let the lead review and optionally refactor the built tests.
  // If theres no output, then the lead agent will build the tests
  output = await agents.lead.build(output ?? fileContents);

  // Calculate the cost of the conversation and output results
  const { cost, tokens } = calculateCost();
  console.log(output, '\n\nTotal cost ($)', cost, '\nTotal tokens used (io)', tokens);
})();
