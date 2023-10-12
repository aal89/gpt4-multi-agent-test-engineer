import { describe, expect, it } from '@jest/globals';
import { AgentMap } from './types';
import testAgent from "./tester";
import leadAgent from "./lead";

describe('Agent functionalities test suite', () => {

  const agents: AgentMap = {
    ...testAgent,
    ...leadAgent,
  };

  for (let [key, value] of Object.entries(agents)) {
    describe(`Testing agent: ${key}`, () => {

      it('should have a name property', () => {
        expect(value).toHaveProperty('role');
      });

      it('should have an id property', () => {
        expect(value).toHaveProperty('build');
      });
    });
  }
});
