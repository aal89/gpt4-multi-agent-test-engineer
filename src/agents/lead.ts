import { Agent } from "openai/_shims";
import { prompt as openaiprompt } from "../openai";
import { encapsulateWithBackTicks } from "./agents";
import { AgentRole } from "./types";

export default {
  [AgentRole.Lead]: {
    role: `You are a senior lead engineer who's role it is to review and/or refactor tests written by other agents.`,
    get question() {
      return (text: string) => openaiprompt(`
      ${this.role}
      ${process.env.ADDITIONAL_AGENT_CONTEXT}

      ${text}
      `);
    },
    get build() {
      return (code: string, humanFeedback?: string) => openaiprompt(`
      ${this.role}
      ${process.env.ADDITIONAL_AGENT_CONTEXT}

      I will supply you tests written by the backend or frontend agents.
      I want you to review, complete and/or refactor these tests so that they are ready to be used without any further work.
      Follow the same coding styles and indentations found in that code.
      Also make sure it's a complete code file with imports and correct paths.

      ${encapsulateWithBackTicks(code)}

      Your output should be only the generated code, no parenthesis, no extra text.
      Your response should start with \`\`\` and end it with \`\`\`.
      
      ${humanFeedback ? `Here's some extra feedback: ${humanFeedback}` : ''}
      `);
    },
  } as Agent,
};
