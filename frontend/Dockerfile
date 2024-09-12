FROM node:18

WORKDIR /knp_frontend

COPY package*.json .

RUN npm install

COPY . .

CMD [ "npm", "start" ]