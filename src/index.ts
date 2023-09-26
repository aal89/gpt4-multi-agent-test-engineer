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
ok(process.env.TOKEN_CAP && Number(process.env.TOKEN_CAP) > 0);
ok(process.env.LLMODEL)

const debug = process.env.DEBUG === 'true';

(async () => {
  let output: string | null = null;

  console.log('Using LLM:', process.env.LLMODEL);

  // Ask for code to build tests for
  const filePath = await input({ message: 'What code to write tests for? Give an absolute path to the file.' });

  const fileContents = readFileSync(filePath, 'utf8');

  if (debug) {
    console.log('\n\n\nFile contents:', fileContents);
  }

  console.log(`Additional context: ${process.env.ADDITIONAL_AGENT_CONTEXT}...`);
  console.log(`Asking the lead who should write the initial tests for the code at ${filePath}...`);

  // Setup conversation between the agents
  // Lead checks to whom this task should be delegated
  const isBackendCode = await agents.lead.question(`
  Given an agent who specializes in API and backend testing, and another agent who specializes in UI and front-end testing.
  Who should write tests for this: ${fileContents}?
  
  I want you to reply the number '1' (without parenthesis) if this is a task for the API and backend agent.
  I want you to reply the number '0' if its an ideal task for the UI and front-end testing agent.
  Reply '-1' if you're unsure.

  Please reply with a single number and nothing else.
`);

  if (debug) {
    console.log('\n\n\nisBackendCode:', isBackendCode);
  }

  if (isBackendCode === '1' || isBackendCode === '-1') {
    console.log('The task is assigned to the API and backend expert...');
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
    throw new Error('No output from the agents');
  }

  console.log('The lead is reviewing the code...');
  // Let the lead review and optionally refactor the built tests.
  output = await agents.lead.build(output);

  if (debug) {
    console.log('\n\n\nLead agent output:', output);
  }

  let additionalTasks: string;
  do {
    console.log('\n\n', '**Output from the lead**', '\n\n');
    console.log(output, '\n\n');

    if (!output) {
      console.log('The lead was unable to write any tests for this code.');
      break;
    }

    additionalTasks = await input({ message: `Are you happy with this result? Type your feedback or write 'y/Y' if you're satisfied with it.` });

    if (additionalTasks === 'y' || additionalTasks === 'Y') {
      break;
    }

    console.log(`Asking the lead to ${additionalTasks}...`);

    output = await agents.lead.build(output, additionalTasks);
    
  } while (additionalTasks !== 'y')


  // Calculate the cost of the conversation and output the results
  const { cost, tokens } = calculateCost();
  console.log('Total cost ($)', cost, '\nTotal tokens used (io)', tokens);
})();
