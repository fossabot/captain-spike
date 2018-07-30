FROM node:10-alpine
RUN apk add --no-cache git

WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm install --prod

COPY bin/ /app/bin/
COPY dist/ /app/dist/

WORKDIR /app/bin
CMD ["node", "cli.js"]
