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
Here are some examples to learn from:

${generateExamplesFromConfig(config)}.

Additional context: ${config.context}

A test engineer wrote the following tests, please review them and refactor them if necessary:

${encapsulateWithBackTicks(code, 'code-to-review')}

When you refactor tests always combine them into one test. Do not summarize or brevify the tests.
The tests must be complete and whole. Don't miss any line, branch or statement.

I know you really like to tell me what you did and why, but don't do that. I don't care.
Your reponse should be only the code you wrote. No additional text, not before, not after. Your
response should start with \`\`\` and end with \`\`\`.
`, 'GPT4');
    },
  } as Agent,
};
