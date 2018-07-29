import { dirSync } from 'tmp';
import simpleGit from 'simple-git/promise';
import touch from 'touch';
import uniqueFilename from 'unique-filename';

import GitAdapter from './git-adapter';
import Commit from '../domain/commit.model';

describe('GitAdapter', () => {
  let tmpFolderObject;

  beforeEach(() => {
    tmpFolderObject = dirSync({ unsafeCleanup: true });
  });

  afterEach(() => {
    tmpFolderObject.removeCallback();
    simpleGit()
      .clearQueue();
  });

  it('should return promise to instance if given path contains git repository', async () => {
    await initTestRepository();

    const gitAdapter = await GitAdapter.create(tmpFolderObject.name);

    expect(gitAdapter)
      .toBeTruthy();
  });

  it('should reject promise if given path contains no git repository', async (done) => {
    const gitAdapterPromise = GitAdapter.create(tmpFolderObject.name);

    const value = await gitAdapterPromise.catch(() => done());
    expect(value).toBe(undefined);
  });

  async function initTestRepository() {
    return simpleGit(tmpFolderObject.name).init(false);
  }

  it('should return all commits of repository', async () => {
    await initTestRepository();

    const commitId1 = await createCommitInRepository();
    const commitId2 = await createCommitInRepository();
    const commitId3 = await createCommitInRepository();

    const gitAdapter = await GitAdapter.create(tmpFolderObject.name);
    const commits = await gitAdapter.getCommits();

    expect(commits)
      .toEqual([new Commit(commitId3), new Commit(commitId2), new Commit(commitId1)]);
  });

  async function createCommitInRepository() {
    touch.sync(uniqueFilename(tmpFolderObject.name));

    const simpleGitTestRepository = simpleGit(tmpFolderObject.name);
    await simpleGitTestRepository.add('*');
    await simpleGitTestRepository.commit('some message');

    return simpleGitTestRepository.show([
      '--format=%H',
      '--no-notes',
      '--no-patch',
    ])
      .then(commitIdWithEndingNewline => commitIdWithEndingNewline.trim());
  }
});
