# Captain Spike: Spot the spiker

## Idea

Imagine you are working on a team and you are practicing Xtreme Programming.
Imagine you don't do code reviews because they are considered as harmful.
And imagine that some of your colleagues love to commit without review or pair programming.

Time to stop this!

## Usage

### Installating from npm repository

TBD

### Start Captain-Spike

```sh
captain-spike <target-git-repository>
```

### Output on single author commits

```json
{
  "singleAuthorCommits": [
    "<commitId1>",
    "<commitId2>",
    "<commitId3>"
  ]
}
```

### Outputs on no single author commits

```json
{
  "singleAuthorCommits": []
}
```

## Development

### Prerequisites

- Have git installed: Version >= 2.14.0
- Have [git-duet](https://github.com/git-duet/git-duet) installed: Version >= 0.6.0

### Building

To build Captain-Spike on your local machine you have to run the following commands:

#### Install dependencies

```sh
npm install
```

#### Run unit tests

```sh
npm run test
```

#### Run acceptance-tests

```sh
npm run acceptance-test
```

#### Please use eslint to force code style

```sh
npm run lint
```

#### running it locally

```
./bin/cli.js <options>
```

### Docker build

You can even build captain spike within docker:

```sh
docker image build -t captain-spike:development .
```

Running it from docker:

```sh
docker container run --rm -i captain-spike:development <options>
```