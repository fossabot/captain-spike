import simpleGit from 'simple-git/promise';
import Commit from '../domain/commit.model';

class GitAdapter {
  constructor(git) {
    this.git = git;
  }

  async getCommits() {
    return (await this.getCommitIds()).map(commitId => new Commit(commitId));
  }

  async getCommitIds() {
    return this.git.raw(['log', '--format=%H'])
      .then(commitIdsWithEndingNewline => commitIdsWithEndingNewline.trim())
      .then(commitIdsLineSeperated => commitIdsLineSeperated.split('\n'));
  }

  static async create(repository) {
    const git = simpleGit(repository);
    if (!await git.checkIsRepo()) {
      return Promise.reject(new Error(`Given path ${repository} is not a git repository`));
    }

    return Promise.resolve(new GitAdapter(git));
  }
}

export { GitAdapter as default };
