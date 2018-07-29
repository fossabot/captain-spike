import simpleGit from 'simple-git/promise';
import Commit from '../domain/commit.model';

class GitAdapter {
  constructor(repository) {
    this.repository = repository;
  }

  async getCommits() {
    const git = simpleGit(this.repository);
    return (await this.getCommitIds(git)).map(commitId => new Commit(commitId));
  }

  async getCommitIds(git) {
    return git.raw(['log', '--format=%H'])
      .then(commitIdsWithEndingNewline => commitIdsWithEndingNewline.trim())
      .then(commitIdsLineSeperated => commitIdsLineSeperated.split('\n'));
  }

  static async create(repository) {
    const git = simpleGit(repository);
    if (!await git.checkIsRepo()) {
      return Promise.reject(new Error(`Given path ${repository} is not a git repository`));
    }

    return Promise.resolve(new GitAdapter(repository));
  }
}

export { GitAdapter as default };
