FROM node:18

WORKDIR /knaw

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 80 7002

CMD [ "node", "server.js" ]