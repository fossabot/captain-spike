import Commit from '../domain/commit.model';
import SpikeFinderService from './spike-finder-service';

describe('SpikeFinderService', () => {
  describe('findSpikes', () => {
    it('should return found spikes', async () => {
      const foundCommits = [new Commit('commit-id-1'), new Commit('commit-id-2')];
      const spikeFinderService = new SpikeFinderService(createRepositoryAdapterFake(foundCommits));

      const result = await spikeFinderService.findSpikes();

      const expectedCommits = [new Commit('commit-id-1'), new Commit('commit-id-2')];
      expect(result).toEqual(expectedCommits);
    });

    function createRepositoryAdapterFake(expectedCommits) {
      return {
        async getSoloCommits() {
          return Promise.resolve(expectedCommits);
        },
      };
    }
  });
});
