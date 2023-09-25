import { prompt } from '../openai';

export enum AgentRole {
  Frontend = 'frontend',
  Backend = 'backend',
  Lead = 'lead',
}

export type Agent = {
  role: string;
  question: typeof prompt;
  build: typeof prompt;
};

export type AgentMap = {
  [key in AgentRole]: Agent;
};