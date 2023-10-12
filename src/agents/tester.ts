import { Agent } from "openai/_shims";
import { prompt as openaiprompt } from "../openai";
import { encapsulateWithBackTicks, generateExamplesFromConfig } from "./agents";
import { AgentRole } from "./types";
import { Config } from "../config";

export default {
  [AgentRole.Tester]: {
    role: 'You are a software engineer specialized in writing automated tests.',
    get build() {
      return (code: string, config: Config) => openaiprompt(this.role, `
Using these technologies: ${config.techstack.join(', ')}.
Using this code and tests as examples:

${generateExamplesFromConfig(config)}.

Additional context: ${config.context}.

Write tests for the following source code:

${encapsulateWithBackTicks(code, 'code-to-write-tests-for')}

Please, make sure the code you write is complete, you don't miss any line, branch or statement.

Your response should be only the code you wrote, no parenthesis, no extra text.
It should start with \`\`\` and end it with \`\`\`.
`, 'GPT35TURBO');
    },
  } as Agent,
};
