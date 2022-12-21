FROM node:18-alpine

WORKDIR /usr/node_app

COPY ./package.json ./

RUN npm install

COPY ./ ./

EXPOSE 4000

CMD ["npm", "start"]

