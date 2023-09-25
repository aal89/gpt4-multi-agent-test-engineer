import { prompt } from '../openai';

export enum AgentRole {
  Frontend = 'frontend',
  Backend = 'backend',
  Lead = 'lead',
}

export type Agent = {
  role: string;
  question: typeof prompt;
  build: (content: string, humanFeedback?: string) => Promise<string | null>;
};

export type AgentMap = {
  [key in AgentRole]: Agent;
};