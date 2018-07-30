import CliResult from '../domain/cli-result.model';

export default class CliAdapter {
  constructor(spikeFinderService) {
    this.spikeFinderService = spikeFinderService;
  }

  async findSpikes() {
    return this.spikeFinderService.findSpikes()
      .then(spikes => new CliResult(spikes))
      .then(cliResult => JSON.stringify(cliResult));
  }
}
