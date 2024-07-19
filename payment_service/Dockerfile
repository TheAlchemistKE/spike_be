FROM node:alpine

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

EXPOSE ["node", "./dist/src/server.js"]
