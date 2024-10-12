# install
docker pull hadish10/knww && docker run -p 7002:7002 -p 7001:7001 -d --restart always hadish10/knww
# remove
docker stop $(docker ps -a -q --filter "ancestor=hadish10/knww") && docker rm $(docker ps -a -q --filter "ancestor=hadish10/knww") && docker rmi hadish10/knww -f