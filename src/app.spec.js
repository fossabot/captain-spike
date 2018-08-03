import { getRepositoryOrThrowError } from './app';

describe('app.js', () => {
  describe('getRepositoryOrThrowError', () => {
    it('should throw error if no argument for git repository was given', () => {
      process.argv = ['node-executable', 'some-script'];

      expect(getRepositoryOrThrowError)
        .toThrow('no repository path was given');
    });

    it('should throw if given path is not existing', () => {
      process.argv = ['node-executable', 'some-script', '/tmp/does/not/exist'];

      expect(getRepositoryOrThrowError)
        .toThrow('given path /tmp/does/not/exist is not existing');
    });

    it('should return path if path exists', () => {
      process.argv = ['node-executable', 'some-script', '/tmp'];

      const path = getRepositoryOrThrowError();

      expect(path).toEqual('/tmp');
    });
  });
});
