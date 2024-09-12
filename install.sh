#!/bin/bash
set -e

if [ "$EUID" -ne 0 ]; then
    echo "Please run as root or use sudo."
    exit
fi

if [ -x "$(command -v docker)" ]; then
    echo "Docker is already installed."
else
    echo "Docker is not installed. Installing..."
    curl -fsSL https://get.docker.com | sh
fi

if [ -x "$(command -v git)" ]; then
    echo "Git is already installed."
else
    echo "Git is not installed. Installing..."
    sudo apt update && sudo apt install -y git
fi

cd /root

if [ -d "knp" ]; then
    echo "Directory knp already exists."
else
    git clone https://github.com/hadish100/kn-panel.git knp
fi

cd knp

echo "Building Docker image for knp_backend..."

docker build -t knp_backend .

if [ -x "$(command -v certbot)" ]; then
    echo "Certbot is already installed."
else
    echo "Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
fi

docker run -it -v /root/knp/.env:/knp_backend/.env -v /root/knp/backup_config.json:/knp_backend/backup_config.json --entrypoint "node" knp_backend config.js

DOMAINS=$(docker run -it -v /root/knp/.env:/knp_backend/.env -v /root/knp/backup_config.json:/knp_backend/backup_config.json --entrypoint "node" knp_backend get_cert_urls.js)

PANEL_DOMAIN=$(echo "$DOMAINS" | grep "PANEL_DOMAIN:" | awk -F': ' '{print $2}')

SUBLINK_DOMAIN=$(echo "$DOMAINS" | grep "SUBLINK_DOMAIN:" | awk -F': ' '{print $2}')

sudo certbot certonly --standalone -d "$PANEL_DOMAIN" -d "$SUBLINK_DOMAIN" --non-interactive --agree-tos --email knpanelbackup@gmail.com

docker compose build

docker compose up -d

sleep 3

docker exec -it mongo-knp mongosh KN_PANEL --eval 'db.accounts.insertOne({ "id": 100000000, "is_admin": 1, "password": "123456", "username": "admin", "tokens": [], "sub_accounts": [] })'

chmod +x cli.sh

sudo mv cli.sh /usr/local/bin/knp

echo "Installation complete. Use 'knp' command to manage the service."

# domains
# telegram bot
# marzban commands
# whitelist
# curl -fsSL https://raw.githubusercontent.com/hadish100/kn-panel/main/install.sh -o install.sh && chmod +x install.sh && ./install.sh

# rm -rf install.sh && rm -rf knp/ && docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q) && docker rmi $(docker images -a -q) -f
