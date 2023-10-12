import { getTotals, prompt } from './openai';

describe('LLMModel testing', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('calculateCost', () => {
    it('should return 0 cost when no tokens are provided', () => {
      const result = getTotals();

      expect(result.cost).toBe('0.00');
      expect(result.tokens).toBe(0);
    });

    it('should calculate cost correctly', async () => {
      const mockResult = {
        usage: { total_tokens: 20000, prompt_tokens: 10000, completion_tokens: 10000 },
        choices: [{ message: { content: 'test' } }],
      };
      global.openAICompletionCreateMock.mockResolvedValue(mockResult);

      await prompt('test', 'test', 'GPT4');
      await prompt('test', 'test', 'GPT35TURBO');

      const result = getTotals();

      expect(result.cost).toBe('0.93');
      expect(result.tokens).toBe(40000);
    });
  });

  describe('prompt', () => {
    it('should throw an error when openai returns no response', async () => {
      global.openAICompletionCreateMock.mockResolvedValue({});

      await expect(prompt('test ', 'test ', 'GPT35TURBO')).rejects.toThrow('No response returned');
    });

    it('should return message content correctly', async () => {
      const mockResult = {
        usage: { total_tokens: 100, prompt_tokens: 50, completion_tokens: 50 },
        choices: [{ message: { content: 'test message content1' } }],
      };
      global.openAICompletionCreateMock.mockResolvedValue(mockResult);

      await expect(prompt('test message content1', 'test message content1', 'GPT35TURBO')).resolves.toBe(mockResult.choices[0].message.content);
    });
  });
});
