FROM node:18

WORKDIR /knsb

COPY package*.json .

RUN npm install

VOLUME /var/lib/marzban

COPY . .

EXPOSE 7002

CMD [ "node", "server.js" ]