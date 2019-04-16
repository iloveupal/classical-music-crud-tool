FROM node:latest
RUN npm i -g yarn
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/
COPY dist /usr/src/app/
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/

EXPOSE 8080

RUN yarn --prod
CMD node /usr/src/app/server.js
