import { prompt as openaiprompt } from "../openai";
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

      expect(openaiprompt).toHaveBeenCalledWith(backend.role, testText);
    });
    
  });

  describe('build method', () => {
    it('calls openai prompt with correct arguments', async () => {
      const code = 'Test code';
      const humanFeedback = 'Test feedback';

      await backend.build(code, humanFeedback);

      expect(openaiprompt).toHaveBeenCalledWith(expect.any(String));
    });
  });
});
