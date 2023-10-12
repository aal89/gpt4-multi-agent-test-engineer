import OpenAI from "openai";
import { program } from "./program";

const LLModel = {
  GPT4: {
    name: 'gpt-4',
    inputPricePerToken: 0.03 / 1000,
    outputPricePerToken: 0.06 / 1000,
  },
  GPT35TURBO: {
    name: 'gpt-3.5-turbo',
    inputPricePerToken: 0.0015 / 1000,
    outputPricePerToken: 0.002 / 1000
  },
}

type Model = keyof typeof LLModel;

let totalTokens = 0;
let totalCost = 0;

const lib = new OpenAI({
  apiKey: program.opts().apiKey,
});

export const getTotals = () => ({
    cost: totalCost.toFixed(2),
    tokens: totalTokens,
})

export const prompt = async (contentRole: string, content: string, model: Model) => {
  const selectedModel = LLModel[model];

  const result = await lib.chat.completions.create({
    model: selectedModel.name,
    messages: [{ role: 'system', content: contentRole }, { role: 'user', content }],
    temperature: 0.2,
  });

  if (!result.usage?.total_tokens || !result.choices.length) {
    throw new Error('No response returned');
  }

  const [choice] = result.choices;
  const { prompt_tokens, completion_tokens } = result.usage;

  // keep track of tokens+cost (output)
  totalTokens += prompt_tokens + completion_tokens;
  totalCost += selectedModel.inputPricePerToken * prompt_tokens + selectedModel.outputPricePerToken * completion_tokens;

  return choice.message.content;
};
