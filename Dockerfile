FROM node:10-alpine as node-10-alpine-git
RUN apk add --no-cache git

FROM node-10-alpine-git as builder
WORKDIR /build
RUN apk add --no-cache curl
RUN mkdir -p /git-duet/git-duet && \
    curl -L -f -o "/git-duet/git-duet-binaries.tar.gz" https://github.com/git-duet/git-duet/releases/download/0.6.0/linux_amd64.tar.gz && \
    tar xz -f "/git-duet/git-duet-binaries.tar.gz" -C "/git-duet/git-duet" && \
    rm -rf "/git-duet/git-duet-binaries"

ENV PATH="/git-duet/git-duet:$PATH"


ADD package.json .
ADD package-lock.json .
RUN npm install


ADD . .
RUN npm run lint
RUN npm run test:ci
RUN npm run acceptance-test
RUN npm run build

FROM node-10-alpine-git as production

WORKDIR /app
COPY --from=builder /build/package.json .
COPY --from=builder /build/package-lock.json .
RUN npm install --prod

COPY --from=builder /build/bin/ ./bin/
COPY --from=builder /build/dist/ ./dist/

WORKDIR /app/bin
CMD ["node", "cli.js"]
