import * as dotenv from 'dotenv'
dotenv.config();

import { ok } from 'assert'
import { input } from '@inquirer/prompts';
import { calculateCost } from './openai'
import agents from './agents/agents';
import { readFileSync } from 'fs'

// Check integrity of environment variables (even optional ones)
ok(process.env.OPENAI_API_KEY);
ok(process.env.ADDITIONAL_AGENT_CONTEXT);

const debug = process.env.DEBUG === 'true';

(async () => {
  let output: string | null = null;
  // Ask for code to build tests for
  const answer = await input({ message: 'What code to write tests for? Give an absolute path to the file.' });

  const fileContents = readFileSync(answer, 'utf8');

  if (debug) {
    console.log('\n\n\nFile contents:', fileContents);
  }

  console.log(`Additional context: ${process.env.ADDITIONAL_AGENT_CONTEXT}...`);
  console.log(`Asking the lead who should write the initial tests for the code at ${answer}...`);

  // Setup conversation between the agents
  // Lead checks to whom this task should be delegated
  const isBackendCode = await agents.lead.question(`Is this a backend code: ${fileContents}. I want you to reply the number '1' (without parenthesis) if this is backend code, '0' if its frontend code and '-1' if you're unsure.`);

  if (debug) {
    console.log('\n\n\nisBackendCode:', isBackendCode);
  }

  if (isBackendCode === '1') {
    console.log('The task is assinged to the API and backend expert...');
    // Backend agent builds tests
    output = await agents.backend.build(fileContents);

    if (debug) {
      console.log('\n\n\nBackend agent output:', output);
    }
  }

  if (isBackendCode === '0') {
    console.log('The task is assinged to the specialist in UI and front-end testing...');
    // Frontend agent builds tests
    output = await agents.frontend.build(fileContents);

    if (debug) {
      console.log('\n\n\nFrontend agent output:', output);
    }
  }

  if (!output) {
    console.log('The lead was unsure if this was frontend or backend code, it will write the tests itself...');
  }

  console.log('The lead is reviewing/writing the code...');
  // Let the lead review and optionally refactor the built tests.
  // If theres no output, then the lead agent will build the tests
  output = await agents.lead.build(output ?? fileContents);

  if (debug) {
    console.log('\n\n\nLead agent output:', output);
  }

  // Calculate the cost of the conversation and output results
  const { cost, tokens } = calculateCost();
  console.log('\n\n', '**Results**', '\n\n');
  console.log(output, '\n\nTotal cost ($)', cost, '\nTotal tokens used (io)', tokens);
})();
