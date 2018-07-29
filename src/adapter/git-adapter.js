import simpleGit from 'simple-git/promise';
import Commit from '../domain/commit.model';

class GitAdapter {
  constructor(git) {
    this.git = git;
  }

  static async create(repository) {
    const git = simpleGit(repository);
    if (!await git.checkIsRepo()) {
      return Promise.reject(new Error(`Given path ${repository} is not a git repository`));
    }

    return Promise.resolve(new GitAdapter(git));
  }

  async getSoloCommits() {
    return (await this.getCommitIds()).map(commitId => new Commit(commitId));
  }

  async getCommitIds() {
    return this.git.raw(['log', '--format=%H', '--grep=Signed-off-by: ', '--invert-grep'])
      .then((logOutput) => {
        if (logOutput === null) {
          return '';
        }
        return logOutput;
      })
      .then(commitIdsWithEndingNewline => commitIdsWithEndingNewline.trim())
      .then(commitIdsLineSeperated => commitIdsLineSeperated.split('\n'))
      .then(commitArray => commitArray.filter(element => element.length > 0));
  }
}

export { GitAdapter as default };
