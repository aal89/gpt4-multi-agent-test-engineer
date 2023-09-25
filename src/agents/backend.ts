import { Agent } from "openai/_shims";
import { prompt as openaiprompt } from "../openai";
import { encapsulateWithBackTicks } from "./agents";
import { AgentRole } from "./types";

export default {
  [AgentRole.Backend]: {
    role: 'You are an expert in API and backend testing and everything not related to UI and front-end testing.',
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

      I want you to write unit tests and or functional tests for all this code:

      ${encapsulateWithBackTicks(code)}

      Follow the same coding styles and best practices found in that code.

      Your output should be only the generated code, no parenthesis, no extra text.
      Also make sure it's a complete code file with imports and correct paths.

      ${humanFeedback ? humanFeedback : ''}
      `);
    },
  } as Agent,
};
