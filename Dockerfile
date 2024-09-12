FROM node:18

WORKDIR /knp_backend

RUN npm install pm2 -g

COPY package*.json .

RUN npm install

COPY . .

CMD ["pm2-runtime", "start", "ecosystem.config.js"]