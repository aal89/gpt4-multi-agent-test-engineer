import frontendAgent from "./frontend";
import backendAgent from "./backend";
import leadAgent from "./lead";
import { AgentMap } from "./types";

export const encapsulateWithBackTicks = (str: string) => '```' + str + '```';

export default {
  ...frontendAgent,
  ...backendAgent,
  ...leadAgent,
} as AgentMap;
