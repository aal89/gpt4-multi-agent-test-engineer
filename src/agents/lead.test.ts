import { prompt as openaiprompt } from "../openai";
import { Agent, AgentRole } from "./types";
import * as b from './lead'

jest.mock('../openai', () => ({
  prompt: jest.fn()
}));

describe('AgentRole', () => {
  let lead: Agent = b.default[AgentRole.Lead];

  it('Lead role should exist', () => {
    expect(lead).toBeDefined();
  });

  it('Lead role should have a build method', () => {
    expect(lead.build).toBeDefined();
    expect(typeof lead.build).toBe("function");
  });

  describe('build method', () => {
    it('calls openai prompt with correct arguments', async () => {
      const code = 'Test code';

      await lead.build(code, {
        techstack: [],
        context: 'test',
        examples: [],
      });

      expect(openaiprompt).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'GPT4');
    });
  });
});
