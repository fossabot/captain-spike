class CliResult {
  constructor(singleAuthorCommits) {
    this.singleAuthorCommits = singleAuthorCommits
      .map(commit => commit.id);
  }
}

export { CliResult as default };
