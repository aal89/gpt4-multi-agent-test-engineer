import OpenAI from "openai";

const LLModel = {
  GPT4: {
    name: 'gpt-4',
    inputPrice: 0.03,
    outputPrice: 0.06
  },
  GPT35TURBO: {
    name: 'gpt-3.5-turbo',
    inputPrice: 0.0015,
    outputPrice: 0.002
  },
}

type Model = keyof typeof LLModel;

const envModelSelection = process.env.LLMODEL ?? '';

const strIsLLMModel = (key: string): key is keyof typeof LLModel => {
  return Object.keys(LLModel).some(k => k === key);
}

export const defaultModel: keyof typeof LLModel = strIsLLMModel(envModelSelection) ? envModelSelection : 'GPT4';

let consumedITokens = 0;
let consumedOTokens = 0;

const lib = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const calculateCost = (model?: Model) => {
  const inputPrice = consumedITokens * LLModel[model ?? defaultModel].inputPrice;
  const outputPrice = consumedOTokens * LLModel[model ?? defaultModel].outputPrice;
  return {
    cost: ((inputPrice + outputPrice) / 1000).toFixed(2),
    tokens: consumedITokens + consumedOTokens,
  }
}

export const prompt = async (content: string, model?: Model) => {
  const totalTokens = consumedITokens + consumedOTokens + content.split(' ').length;
  if (totalTokens >= Number(process.env.TOKEN_CAP)) {
    return 'Token cap reached...'
  }

  const result = await lib.chat.completions.create({
    model: LLModel[model ?? defaultModel].name,
    messages: [{ role: 'user', content }],
  });

  if (!result.usage?.total_tokens || !result.choices.length) {
    throw new Error('No response returned');
  }

  const [choice] = result.choices;
  const { prompt_tokens, completion_tokens } = result.usage;

  consumedITokens += prompt_tokens;
  consumedOTokens += completion_tokens;

  return choice.message.content;
};
