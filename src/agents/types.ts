import { Config } from "../config";

export enum AgentRole {
  Tester = 'tester',
  Lead = 'lead',
}

export type Agent = {
  role: string;
  build: (content: string, config: Config) => Promise<string | null>;
};

export type AgentMap = {
  [key in AgentRole]: Agent;
};