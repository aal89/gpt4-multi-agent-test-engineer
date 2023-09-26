import { calculateCost, prompt } from './openai';

const createMock = jest.fn();

jest.mock('openai', () => ({
  ...jest.requireActual('openai'),
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(() => createMock()),
      },
    },
  } as any)),
}));

describe('LLMModel testing', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('calculateCost', () => {
    it('should return 0 cost when no tokens are provided', () => {
      const result = calculateCost();

      expect(result.cost).toBe('0.00');
      expect(result.tokens).toBe(0);
    });

    it('should calculate cost correctly', async () => {
      const mockResult = {
        usage: { total_tokens: 2000, prompt_tokens: 1000, completion_tokens: 1000 },
        choices: [{ message: { content: 'test' } }],
      };
      createMock.mockResolvedValue(mockResult);

      await prompt('test');

      const result = calculateCost();

      expect(result.cost).toBe('0.09');
      expect(result.tokens).toBe(2000);
    });
  });

  describe('prompt', () => {
    it('should return an error message when token cap is exceeded', async () => {      
      const message = 'test '.repeat(10001);
      createMock.mockResolvedValue({ usage: { total_tokens: 10001 }, choices: [{ message }] } as any);

      const result = await prompt(message);
      expect(result).toBe(`Token cap reached...`);
    });

    it('should throw an error when openai returns no response', async () => {
      createMock.mockResolvedValue({});

      await expect(prompt('test ')).rejects.toThrow('No response returned');
    });

    it('should return message content correctly', async () => {
      const mockResult = {
        usage: { total_tokens: 100, prompt_tokens: 50, completion_tokens: 50 },
        choices: [{ message: { content: 'test message content1' } }],
      };
      createMock.mockResolvedValue(mockResult);

      await expect(prompt('test message content1')).resolves.toBe(mockResult.choices[0].message.content);
    });
  });
});
