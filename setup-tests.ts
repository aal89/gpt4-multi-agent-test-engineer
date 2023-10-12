jest.mock('commander', () => {
  return {
    ...jest.requireActual('commander'),
    Command: jest.fn().mockImplementation(() => ({
      name: jest.fn().mockReturnThis(),
      description: jest.fn().mockReturnThis(),
      version: jest.fn().mockReturnThis(),
      argument: jest.fn().mockReturnThis(),
      requiredOption: jest.fn().mockReturnThis(),
      parse: jest.fn(),
      opts: jest.fn(() => jest.fn()),
      args: 'test.js',
    })),

  }
});

global.openAICompletionCreateMock = jest.fn();

jest.mock('openai', () => ({
  ...jest.requireActual('openai'),
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(() => global.openAICompletionCreateMock()),
      },
    },
  } as any)),
}));
