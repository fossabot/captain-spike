#!/usr/bin/env sh

npx semantic-release
version="$(git describe --tags `git rev-list --tags --max-count=1` | sed 's/v//g')"
docker image tag jaedle/captain-spike:latest jaedle/captain-spike:${version}
docker push jaedle/captain-spike:latest
docker push jaedle/captain-spike:${version}
