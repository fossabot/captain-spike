import { dirSync } from 'tmp';
import simpleGit from 'simple-git/promise';
import touch from 'touch';
import uniqueFilename from 'unique-filename';

import fs from 'fs';
import GitAdapter from './git-adapter';
import Commit from '../domain/commit.model';

describe('GitAdapter', () => {
  let tempFolderObject;
  let defaultGitEnv;
  let tempRepository;

  beforeEach(() => {
    tempFolderObject = dirSync({ unsafeCleanup: true });
    defaultGitEnv = {
      PATH: process.env.PATH,
      HOME: tempFolderObject.name,
    };

    tempRepository = simpleGit(tempFolderObject.name)
      .env(defaultGitEnv);
  });

  afterEach(() => {
    tempFolderObject.removeCallback();
  });

  describe('create', () => {
    it('should return promise to instance if given path contains git repository', async () => {
      await initTestRepository();

      const gitAdapter = await GitAdapter.create(tempFolderObject.name);

      expect(gitAdapter)
        .toBeTruthy();
    });

    it('should reject promise if given path contains no git repository', async (done) => {
      const gitAdapterPromise = GitAdapter.create(tempFolderObject.name);

      const value = await gitAdapterPromise.catch(() => done());
      expect(value)
        .toBe(undefined);
    });
  });

  async function initTestRepository() {
    await tempRepository.init(false);
    await tempRepository.addConfig('user.email', 'some.mail@domain.sth');
    return tempRepository.addConfig('user.name', 'My Username');
  }

  describe('getSoloCommits', () => {
    it('should reject promise on empty master branch', async (done) => {
      await initTestRepository();

      const gitAdapter = await GitAdapter.create(tempFolderObject.name);

      await gitAdapter.getSoloCommits()
        .catch(() => done());
    });

    it('should return commit ids of solo commits', async () => {
      await initTestRepository();

      const soloCommitId1 = await createSoloCommit();
      const soloCommitId2 = await createSoloCommit();

      const gitAdapter = await GitAdapter.create(tempFolderObject.name);
      const commits = await gitAdapter.getSoloCommits();

      expect(commits)
        .toEqual([new Commit(soloCommitId2), new Commit(soloCommitId1)]);
    });

    async function createSoloCommit() {
      touch.sync(uniqueFilename(tempFolderObject.name));

      await tempRepository.add('*');
      await tempRepository.commit('some message', {
        '--author': 'Single-Commiter <no-review@this.commit>',
      });

      return tempRepository.show([
        '--format=%H',
        '--no-notes',
        '--no-patch',
      ])
        .then(commitIdWithEndingNewline => commitIdWithEndingNewline.trim());
    }

    it('should return no commit if all commits were done with sign-offs', async () => {
      await initTestRepository();

      await createPairCommit();
      await createPairCommit();

      const gitAdapter = await GitAdapter.create(tempFolderObject.name);
      const commits = await gitAdapter.getSoloCommits();

      expect(commits)
        .toEqual([]);
    });

    async function createPairCommit() {
      await setPairForCommit();

      touch.sync(uniqueFilename(tempFolderObject.name));
      await tempRepository.add('*');

      await tempRepository.raw([
        'duet-commit',
        '-m',
        'some commit message',
      ]);
    }

    async function setPairForCommit() {
      const gitAuthorsConfiguration = `authors:
  commiter1: Co Mitter One
  commiter2: Co Mitter TWo
email_addresses:
  commiter1: one@co.mitter
  commiter2: two@co.mitter  
  `;
      fs.writeFileSync(`${tempFolderObject.name}/.git-authors`, gitAuthorsConfiguration);
      return tempRepository.raw([
        'duet',
        'commiter1',
        'commiter2',
      ]);
    }

    it('should return only the commits done by single author', async () => {
      await initTestRepository();

      await createPairCommit();
      const soloCommitId1 = await createSoloCommit();
      await createPairCommit();
      const soloCommitId2 = await createSoloCommit();
      await createPairCommit();
      await createPairCommit();
      const soloCommitId3 = await createSoloCommit();
      await createPairCommit();

      const gitAdapter = await GitAdapter.create(tempFolderObject.name);
      const commits = await gitAdapter.getSoloCommits();

      expect(commits)
        .toEqual([new Commit(soloCommitId3), new Commit(soloCommitId2), new Commit(soloCommitId1)]);
    });
  });
});
