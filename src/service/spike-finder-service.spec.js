import Commit from '../domain/commit.model';
import SpikeFinderService from './spike-finder-service';

describe('SpikeFinderService', () => {
  describe('findSpikes', () => {
    it('should return found spikes', async () => {
      const repositoryAdapterFake = {
        async getSoloCommits() {
          return Promise.resolve([new Commit('commit-id-1'), new Commit('commit-id-2')]);
        },
      };
      const spikeFinderService = new SpikeFinderService(repositoryAdapterFake);

      const result = await spikeFinderService.findSpikes();

      expect(result).toEqual([new Commit('commit-id-1'), new Commit('commit-id-2')]);
    });
  });
});
