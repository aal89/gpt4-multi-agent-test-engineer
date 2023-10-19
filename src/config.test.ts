import { findConfigFile } from './config';
import fs from 'fs';

describe('config', () => {
  describe('findConfigFile', () => {
    it('should return the path of the config file if it exists', () => {
      const expectedPath = '/path/to/config/autotestgpt.config.yaml';
      jest.spyOn(process, 'cwd').mockReturnValue('/path/to/config');
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = findConfigFile();

      expect(result).toEqual(expectedPath);
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
});
