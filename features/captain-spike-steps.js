import {
  After, Given, Then, When,
} from 'cucumber';

import assert from 'assert';
import { exec } from 'child_process';
import faker from 'faker';
import fs from 'fs';
import git from 'simple-git/promise';
import tmp from 'tmp';
import touch from 'touch';
import uniqueFilename from 'unique-filename';
import util from 'util';

let temporaryRepositoryFolder;
let repository;
let defaultGitEnv;
let result;
const singleAuthorCommits = [];

After(() => {
  temporaryRepositoryFolder.removeCallback();
});

Given('a git repository', async () => {
  temporaryRepositoryFolder = tmp.dirSync({ unsafeCleanup: true });

  defaultGitEnv = { PATH: process.env.PATH };

  repository = git(temporaryRepositoryFolder.name)
    .env(defaultGitEnv);

  await repository.init(false);
  await repository.addConfig('user.email', 'some.mail@domain.sth');
  await repository.addConfig('user.name', 'My Username');
});

function createUntrackedFile() {
  touch.sync(uniqueFilename(temporaryRepositoryFolder.name));
}

Given('{int} commits with a single author', async (numberOfCommits) => {
  for (let i = 1; i <= numberOfCommits; i += 1) {
    /* eslint-disable no-await-in-loop */
    singleAuthorCommits.push(await createNewCommit());
    /* eslint-enable no-await-in-loop */
  }
});

async function createNewCommit() {
  createUntrackedFile();

  const message = faker.lorem.words(5);
  const commiter = faker.name.findName(undefined, undefined, undefined);
  const mailAddress = faker.internet.email();

  await repository.add('*');

  await repository.commit(message, {
    '--author': `"${commiter} <${mailAddress}>"`,
  });

  return repository.show([
    '--format=%H',
    '--no-notes',
    '--no-patch',
  ])
    .then(commitIdWithEndingNewline => commitIdWithEndingNewline.trim());
}

Given('{int} commits created with co-authored', async (numberOfCommits) => {
  for (let i = 1; i <= numberOfCommits; i += 1) {
    /* eslint-disable no-await-in-loop */
    await createNewSignedOffCommit();
    /* eslint-enable no-await-in-loop */
  }
});

function createNewSignedOffCommit() {
  createUntrackedFile();

  const duetCommitMetada = {
    message: faker.lorem.words(5),
    commiter1: {
      name: faker.name.findName(undefined, undefined, undefined),
      mailAddress: faker.internet.email(),
    },
    commiter2: {
      name: faker.name.findName(undefined, undefined, undefined),
      mailAddress: faker.internet.email(),
    },
  };

  return duetCommitAllUntrackedChanges(duetCommitMetada);
}

async function duetCommitAllUntrackedChanges(commitMetadata) {
  createAuthorsFile(commitMetadata.commiter1, commitMetadata.commiter2);
  await repository.add('*');
  await setDuet();

  return repository.raw([
    'duet-commit',
    '-m',
    `"${commitMetadata.message}"`,
  ]);
}

async function setDuet() {
  await repository
    .raw([
      'duet',
      'commiter1',
      'commiter2',
    ]);
}

function createAuthorsFile(commiter1, commiter2) {
  removeGitAuthorsFileIfPresent();

  const gitAuthors = `authors:
  commiter1: ${commiter1.name}
  commiter2: ${commiter2.name}
email_addresses:
  commiter1: ${commiter1.mailAddress}
  commiter2: ${commiter2.mailAddress}  
  `;

  fs.writeFileSync(`${temporaryRepositoryFolder.name}/.git-authors`, gitAuthors);
}

function removeGitAuthorsFileIfPresent() {
  const gitAuthorsFile = `${temporaryRepositoryFolder.name}/.git-authors`;
  if (fs.existsSync(gitAuthorsFile)) {
    fs.unlinkSync(gitAuthorsFile);
  }
}

When('I start captain-spike', async () => {
  const execAsync = util.promisify(exec);
  const { stdout } = await execAsync(`bin/cli.js ${temporaryRepositoryFolder.name}`);

  result = stdout;
});

Then('it should output the commits with a single author', () => {
  const commitsWithNewestCommitFirst = singleAuthorCommits.reverse();
  const expected = { singleAuthorCommits: commitsWithNewestCommitFirst };
  const resultJson = JSON.parse(result);

  assert.deepStrictEqual(resultJson, expected);
});
