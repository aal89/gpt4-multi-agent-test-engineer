/* eslint-disable */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./setup-tests.ts'],
  transform: {
    '^.+\\.ts?$': ['ts-jest', {
      isolatedModules: true,
    }],
  },
};