FROM node:10-alpine as node-10-alpine-git
RUN apk add --no-cache git

FROM node-10-alpine-git as builder
WORKDIR /build
ADD package.json .
ADD package-lock.json .
RUN npm install

ADD . .
RUN npm run lint
RUN npm run build
    RUN npm run test
RUN npm run acceptance-test

FROM node-10-alpine-git as production

WORKDIR /app
COPY --from=builder /build/package.json .
COPY --from=builder /build/package-lock.json .
RUN npm install --prod

COPY --from=builder /build/bin/ ./bin/
COPY --from=builder /build/dist/ ./dist/

WORKDIR /app/bin
CMD ["node", "cli.js"]
