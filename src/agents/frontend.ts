import { Agent } from "openai/_shims";
import { prompt as openaiprompt } from "../openai";
import { encapsulateWithBackTicks } from "./agents";
import { AgentRole } from "./types";

export default {
  [AgentRole.Frontend]: {
    role: 'You are an agent that specializes in UI and front-end testing',
    get question() {
      return (text: string) => openaiprompt(`
      ${this.role}
      ${text}
      `);
    },
    get build() {
      return (code: string) => openaiprompt(`
      ${this.role}

      I want you to write unit tests and or component tests for all this code:

      ${encapsulateWithBackTicks(code)}

      Follow the same coding styles and best practices found in that code.

      Your output should be code only as a string, no need for backticks.
      `);
    },
  } as Agent,
};
