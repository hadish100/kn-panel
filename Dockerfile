FROM node:18

WORKDIR /knp_backend

RUN npm install pm2 -g

COPY package*.json .

RUN npm install

EXPOSE 5000

COPY . .

CMD ["pm2-runtime", "start", "server.js", "--name", "server", "--", \
     "&&", "pm2", "start", "sync.js", "--name", "sync", "--", \
     "&&", "pm2", "start", "backup_config.js", "--name", "backup"]