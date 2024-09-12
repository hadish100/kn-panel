FROM node:18

WORKDIR /knp_backend

RUN npm install pm2 -g

RUN apt-get update && apt-get install -y certbot python3-certbot-nginx

COPY package*.json .

RUN npm install

COPY . .

CMD ["pm2-runtime", "start", "server.js", "--name", "server", "--", \
     "&&", "pm2", "start", "sync.js", "--name", "sync", "--", \
     "&&", "pm2", "start", "backup_config.js", "--name", "backup"]