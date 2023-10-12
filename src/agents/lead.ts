import { Agent } from "openai/_shims";
import { prompt as openaiprompt } from "../openai";
import { encapsulateWithBackTicks, generateExamplesFromConfig } from "./agents";
import { AgentRole } from "./types";
import { Config } from "../config";

export default {
  [AgentRole.Lead]: {
    role: `You are a lead software engineer specialized in reviewing other peoples code.`,
    get build() {
      return (code: string, config: Config) => openaiprompt(this.role, `
Using these technologies: ${config.techstack.join(', ')}.
Using this code and tests as examples:

${generateExamplesFromConfig(config)}.

Additional context: ${config.context}

A test engineer wrote the following tests, please review them and refactor them if necessary:

${encapsulateWithBackTicks(code, 'code-to-review')}

Make sure the code you write is complete, you don't miss any line, branch or statement.

**VERY IMPORTANT**
Your response should be only the code you wrote, no parenthesis, no extra text.
It should start with \`\`\` and end it with \`\`\`.
**VERY IMPORTANT**
`, 'GPT4');
    },
  } as Agent,
};
