#!/bin/bash

apt-get update; apt-get upgrade -y; apt-get install curl socat git -y

if [ -x "$(command -v docker)" ]; then
    echo "Docker is already installed."
else
    echo "Docker is not installed. Installing..."
    curl -fsSL https://get.docker.com | sh
fi

git clone https://github.com/Gozargah/Marzban-node
mkdir /var/lib/marzban-node

curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

cd ~/Marzban-node

git clone https://github.com/KN-VPN/node-cli.git
cd node-cli
npm install
node config.js
cd ../
docker compose up -d

echo 'alias mnode_cli_restart="cd ~/Marzban-node && docker compose down && docker compose up -d"' >> ~/.bashrc


# curl -fsSL https://raw.githubusercontent.com/KN-VPN/node-cli/main/run.sh -o run.sh && chmod +x run.sh && ./run.sh