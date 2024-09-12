#!/bin/bash

if [ -x "$(command -v docker)" ]; then
    echo "Docker is already installed."
else
    echo "Docker is not installed. Installing..."
    curl -fsSL https://get.docker.com | sh
fi

cd /root

git clone https://github.com/hadish100/kn-panel.git knp

cd knp

docker build -t knp_backend .

sudo apt install certbot python3-certbot-nginx

docker run -it -v /root/knp/.env:/knp_backend/.env -v /root/knp/backup_config.json:/knp_backend/backup_config.json --entrypoint "node" knp_backend config.js

docker compose build

docker compose up -d

sleep 3

docker exec -it mongo-knp mongo KN_PANEL --eval 'db.accounts.insertOne({ "id": 100000000, "is_admin": 1, "password": "123456", "username": "admin", "tokens": [], "sub_accounts": [] })'


