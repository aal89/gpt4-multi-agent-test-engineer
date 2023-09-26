import { Agent } from "openai/_shims";
import { prompt as openaiprompt } from "../openai";
import { encapsulateWithBackTicks } from "./agents";
import { AgentRole } from "./types";

export default {
  [AgentRole.Frontend]: {
    role: 'You specialize in UI and front-end testing.',
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

      I want you to write unit tests for all the following code.
      Follow the same coding styles found in that code.
      Also make sure it's a complete code file with imports and correct paths.

      ${encapsulateWithBackTicks(code)}

      Make sure the you write is complete and you dont miss tests for any component you find.

      ${humanFeedback ? `Here's some extra feedback: ${humanFeedback}` : ''}
      `);
    },
  } as Agent,
};
