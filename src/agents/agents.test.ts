import { encapsulateWithBackTicks } from './agents';
import { describe, expect, it } from '@jest/globals';
import { AgentMap } from './types';
import frontendAgent from "./frontend";
import backendAgent from "./backend";
import leadAgent from "./lead";

describe('Agent functionalities test suite', () => {

  const agents: AgentMap = {
    ...frontendAgent,
    ...backendAgent,
    ...leadAgent,
  };

  for (let [key, value] of Object.entries(agents)) {
    describe(`Testing agent: ${key}`, () => {

      it('should have a name property', () => {
        expect(value).toHaveProperty('role');
      });

      it('should have an id property', () => {
        expect(value).toHaveProperty('question');
      });

      it('should have an id property', () => {
        expect(value).toHaveProperty('build');
      });
    });
  }
});
