export default class SpikeFinderService {
  constructor(repositoryAdapter) {
    this.repositoryAdapter = repositoryAdapter;
  }

  async findSpikes() {
    return this.repositoryAdapter.getSoloCommits();
  }
}
