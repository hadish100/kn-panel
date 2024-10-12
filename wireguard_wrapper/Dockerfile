FROM node:18

WORKDIR /knww

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 7001 7002

CMD [ "node", "server.js" ]