import { prompt as openaiprompt } from "../openai";
import { encapsulateWithBackTicks } from "./agents";
import { Agent, AgentRole } from "./types";
import * as b from './frontend'

jest.mock('../openai', () => ({
  prompt: jest.fn()
}));

describe('AgentRole', () => {
  let frontend: Agent = b.default[AgentRole.Frontend];

  it('Frontend role should exist', () => {
    expect(frontend).toBeDefined();
  });

  it('Frontend role should have a question method', () => {
    expect(frontend.question).toBeDefined();
    expect(typeof frontend.question).toBe("function");
  });

  it('Frontend role should have a build method', () => {
    expect(frontend.build).toBeDefined();
    expect(typeof frontend.build).toBe("function");
  });

  describe('question method', () => {
    it('calls openai prompt with correct arguments', async () => {
      const testText = 'Test question';
      await frontend.question(testText);

      expect(openaiprompt).toHaveBeenCalledWith(`
      ${frontend.role}
      ${process.env.ADDITIONAL_AGENT_CONTEXT}

      ${testText}
      `);
    });
    
  });

  describe('build method', () => {
    it('calls openai prompt with correct arguments', async () => {
      const code = 'Test code';
      const humanFeedback = 'Test feedback';

      await frontend.build(code, humanFeedback);

      expect(openaiprompt).toHaveBeenCalledWith(`
      ${frontend.role}
      ${process.env.ADDITIONAL_AGENT_CONTEXT}

      I want you to write unit tests and or component tests for all this code:

      ${encapsulateWithBackTicks(code)}

      Follow the same coding styles and best practices found in that code.

      Your output should be only the generated code, no parenthesis, no extra text.
      Also make sure it's a complete code file with imports and correct paths.

      ${humanFeedback}
      `);
    });
  });
});
