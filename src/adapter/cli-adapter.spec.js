import Commit from '../domain/commit.model';
import CliAdapter from './cli-adapter';

describe('CliAdapter', () => {
  it('should throw error if GIT_FOLDER is not defined', async () => {
    const spikeFinderService = {
      async findSpikes() {
        return Promise.resolve([
          new Commit('commit-id-1'),
          new Commit('commit-id-2'),
          new Commit('commit-id-3'),
        ]);
      },
    };
    const cliAdapter = new CliAdapter(spikeFinderService);

    const result = await cliAdapter.findSpikes();

    const expectedResult = {
      singleAuthorCommits: [
        'commit-id-1',
        'commit-id-2',
        'commit-id-3',
      ],
    };

    expect(JSON.parse(result)).toEqual(expectedResult);
  });
});
