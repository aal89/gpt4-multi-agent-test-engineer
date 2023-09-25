import OpenAI from "openai";

const LLMModel: Record<string, { name: string, inputPrice: number, outputPrice: number }> = {
  GPT4: {
    name: 'gpt-4',
    inputPrice: 0.03,
    outputPrice: 0.06
  },
}

export const MODEL: keyof typeof LLMModel = 'GPT4';

let consumedITokens = 0;
let consumedOTokens = 0;

const lib = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const calculateCost = () => {
  return {
    cost: ((consumedITokens * LLMModel[MODEL].inputPrice + consumedOTokens * LLMModel[MODEL].outputPrice) / 1000).toFixed(2),
    tokens: consumedITokens + consumedOTokens,
  }
}

export const prompt = async (content: string) => {
  const result = await lib.chat.completions.create({
    model: LLMModel[MODEL].name,
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
