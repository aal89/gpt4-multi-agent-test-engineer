import { findConfigFile, validateConfig } from './config';
import fs from 'fs';

describe('program', () => {
  describe('findConfigFile', () => {
    it('should return the path to the config file if it exists', () => {
      const expectedPath = '/path/to/config/autotestgpt.config.yaml';
      jest.spyOn(process, 'cwd').mockReturnValue('/path/to/config');
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = findConfigFile();

      expect(result).toBe(expectedPath);
    });

    it('should return null if the config file does not exist', () => {
      jest.spyOn(process, 'cwd').mockReturnValue('/path/to/config');
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      const result = findConfigFile();

      expect(result).toBeNull();
    });

    it('should return the path of the config file if it exists', () => {
      const expectedPath = '/path/autotestgpt.config.yaml';
      jest.spyOn(process, 'cwd').mockReturnValue('/path/to/config');
      jest.spyOn(fs, 'existsSync')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValue(true);

      const result = findConfigFile();

      expect(result).toEqual(expectedPath);
    });
  });

  describe('validateConfig', () => {
    it('should throw an error if the config is not an array', () => {
      const config = {};

      expect(() => validateConfig(config as Array<unknown>)).toThrow('Invalid config. See README.');
    });

    it('should throw an error if any item in the config is not an object', () => {
      const config = [null];

      expect(() => validateConfig(config)).toThrow('Invalid config. See README.');
    });

    it('should set default values for techstack, context, and examples if they are missing or invalid', () => {
      const config = [
        {
          '.js': {},
        },
      ];

      const result = validateConfig(config);

      expect(result).toEqual([
        {
          '.js': {
            techstack: [],
            context: '',
            examples: [],
          },
        },
      ]);
    });

    it('should throw an error if any example is missing name, code, or tests properties', () => {
      const config = [
        {
          '.js': {
            examples: [
              {
                name: 'Example 1',
                code: 'example1.js',
              },
            ],
          },
        },
      ];

      expect(validateConfig(config)).toEqual([{
        '.js': {
          techstack: [],
          context: '',
          examples: [
            {
              name: 'Example 1',
              code: 'example1.js',
              tests: '',
            },
          ],
        },
      }]);
    });

    it('should throw an error if any example code or tests file does not exist', () => {
      jest.spyOn(process, 'cwd').mockReturnValue('/path/to/config');

      const config = [
        {
          '.js': {
            examples: [
              {
                name: 'Example 1',
                code: 'example1.js',
                tests: 'example1.test.js',
              },
            ],
          },
        },
      ];

      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false).mockReturnValueOnce(true);

      expect(() => validateConfig(config)).toThrow('Unable to find code or tests file for example Example 1, check paths in config.');
    });

    it('should return the validated config', () => {
      jest.spyOn(process, 'cwd').mockReturnValue('/path/to/config');

      const config = [
        {
          '.js': {
            techstack: ['typescript', 'jest'],
            context: 'context',
            examples: [
              {
                name: 'Example 1',
                code: 'example1.js',
                tests: 'example1.test.js',
              },
            ],
          },
        },
      ];

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = validateConfig(config);

      expect(result).toEqual([
        {
          '.js': {
            techstack: ['typescript', 'jest'],
            context: 'context',
            examples: [
              {
                name: 'Example 1',
                code: 'example1.js',
                tests: 'example1.test.js',
              },
            ],
          },
        },
      ]);
    });
  });
});
