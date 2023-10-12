type EnvType = {
  OPENAI_API_KEY: string;
};

export default {
  OPENAI_API_KEY: process.env.AUTOTESTGPT_OPENAI_API_KEY,
} as EnvType;