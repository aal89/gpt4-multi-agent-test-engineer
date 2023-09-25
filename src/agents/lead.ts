import { Agent } from "openai/_shims";
import { prompt as openaiprompt } from "../openai";
import { encapsulateWithBackTicks } from "./agents";
import { AgentRole } from "./types";

export default {
  [AgentRole.Lead]: {
    role: `You are a senior lead (test) engineer who's role it is to review and refactor tests`,
    get question() {
      return (text: string) => openaiprompt(`
      ${this.role}
      ${text}
      `);
    },
    get build() {
      return (tests: string) => openaiprompt(`
      ${this.role}

      I want you to review, complete and or refactor these tests so that they are production ready:

      ${encapsulateWithBackTicks(tests)}

      Follow the same coding styles and best practices found in that code.

      Your output should be code only as a string, no need for backticks.
      `);
    },
  } as Agent,
};
