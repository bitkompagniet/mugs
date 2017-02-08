FROM node:7.5

RUN npm i -g yarn
RUN mkdir -p /app
WORKDIR /app
ADD package.json /app
ADD yarn.lock /app
RUN yarn

ADD . /app

CMD npm run production