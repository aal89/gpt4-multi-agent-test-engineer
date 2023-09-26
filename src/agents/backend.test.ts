import { prompt as openaiprompt } from "../openai";
import { encapsulateWithBackTicks } from "./agents";
import { Agent, AgentRole } from "./types";
import * as b from './backend'

jest.mock('../openai', () => ({
  prompt: jest.fn()
}));

describe('AgentRole', () => {
  let backend: Agent = b.default[AgentRole.Backend];

  it('Backend role should exist', () => {
    expect(backend).toBeDefined();
  });

  it('Backend role should have a question method', () => {
    expect(backend.question).toBeDefined();
    expect(typeof backend.question).toBe("function");
  });

  it('Backend role should have a build method', () => {
    expect(backend.build).toBeDefined();
    expect(typeof backend.build).toBe("function");
  });

  describe('question method', () => {
    it('calls openai prompt with correct arguments', async () => {
      const testText = 'Test question';
      await backend.question(testText);

      expect(openaiprompt).toHaveBeenCalledWith(`
      ${backend.role}
      ${process.env.ADDITIONAL_AGENT_CONTEXT}

      ${testText}
      `);
    });
    
  });

  describe('build method', () => {
    it('calls openai prompt with correct arguments', async () => {
      const code = 'Test code';
      const humanFeedback = 'Test feedback';

      await backend.build(code, humanFeedback);

      expect(openaiprompt).toHaveBeenCalledWith(`
      ${backend.role}
      ${process.env.ADDITIONAL_AGENT_CONTEXT}

      I want you to write unit tests and or functional tests for all this code:

      ${encapsulateWithBackTicks(code)}

      Follow the same coding styles and best practices found in that code.

      Your output should be only the generated code, no parenthesis, no extra text.
      Also make sure it's a complete code file with imports and correct paths.

      ${humanFeedback}
      `);
    });
  });
});