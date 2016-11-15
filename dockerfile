FROM node:7

RUN mkdir /app
WORKDIR /app

ADD package.json /app
RUN npm install --production
ADD . /app

ENV rumor trace

EXPOSE 3000

CMD node run-server.js
