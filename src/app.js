import {existsSync} from 'fs';

export default function main() {
  const repository = getRepositoryOrThrowError();
  console.log({});
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
