export default class SpikeFinderService {
  constructor(repositoryAdapter) {
    this.repositoryAdapter = repositoryAdapter;
  }


  findSpikes() {
    return this.repositoryAdapter.getSoloCommits();
  }
}
