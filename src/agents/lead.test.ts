import { prompt as openaiprompt } from "../openai";
import { encapsulateWithBackTicks } from "./agents";
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

  it('Lead role should have a question method', () => {
    expect(lead.question).toBeDefined();
    expect(typeof lead.question).toBe("function");
  });

  it('Lead role should have a build method', () => {
    expect(lead.build).toBeDefined();
    expect(typeof lead.build).toBe("function");
  });

  describe('question method', () => {
    it('calls openai prompt with correct arguments', async () => {
      const testText = 'Test question';
      await lead.question(testText);

      expect(openaiprompt).toHaveBeenCalledWith(`
      ${lead.role}
      ${process.env.ADDITIONAL_AGENT_CONTEXT}

      ${testText}
      `);
    });
    
  });

  describe('build method', () => {
    it('calls openai prompt with correct arguments', async () => {
      const code = 'Test code';
      const humanFeedback = 'Test feedback';

      await lead.build(code, humanFeedback);

      expect(openaiprompt).toHaveBeenCalledWith(`
      ${lead.role}
      ${process.env.ADDITIONAL_AGENT_CONTEXT}

      I want you to review, complete and or refactor these tests so that they are production ready:

      ${encapsulateWithBackTicks(code)}
      
      Follow the same coding styles, best practices and indentations found in that code.
      
      Your output should be only the generated code, no parenthesis, no extra text.
      Also make sure it's a complete code file with imports and correct paths.
      
      ${humanFeedback}
      `);
    });
  });
});
