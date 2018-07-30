import { existsSync } from 'fs';
import SpikeFinderService from './service/spike-finder-service';
import GitAdapter from './adapter/git-adapter';
import CliAdapter from './adapter/cli-adapter';


export default async function main() {
  const repository = getRepositoryOrThrowError();

  const gitAdapter = new GitAdapter(repository);
  const spikeFinderService = new SpikeFinderService(gitAdapter);
  const cliAdapter = new CliAdapter(spikeFinderService);

  const foundSpikes = await cliAdapter.findSpikes();
  console.log(foundSpikes);
}

export function getRepositoryOrThrowError() {
  if (process.argv.length < 3) {
    throw new Error('no repository path was given');
  }

  const repositoryPath = process.argv[2];
  if (!existsSync(repositoryPath)) {
    throw new Error(`given path ${repositoryPath} is not existing`);
  }

  return repositoryPath;
}
