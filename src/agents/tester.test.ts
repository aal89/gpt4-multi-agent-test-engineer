import { prompt as openaiprompt } from "../openai";
import { Agent, AgentRole } from "./types";
import * as t from './tester'

jest.mock('../openai', () => ({
  prompt: jest.fn()
}));

describe('AgentRole', () => {
  let tester: Agent = t.default[AgentRole.Tester];

  it('Backend role should exist', () => {
    expect(tester).toBeDefined();
  });

  it('Backend role should have a build method', () => {
    expect(tester.build).toBeDefined();
    expect(typeof tester.build).toBe("function");
  });

  describe('build method', () => {
    it('calls openai prompt with correct arguments', async () => {
      const code = 'Test code';

      await tester.build(code, {
        techstack: [],
        context: 'test',
        examples: [],
      });

      expect(openaiprompt).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'GPT35TURBO');
    });
  });
});
