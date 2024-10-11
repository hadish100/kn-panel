# install
docker pull hadish10/knaw && docker run -p 7002:7002 -p 7001:7001 -d --restart always hadish10/knaw
# remove
docker stop $(docker ps -a -q --filter "ancestor=hadish10/knaw") && docker rm $(docker ps -a -q --filter "ancestor=hadish10/knaw") && docker rmi hadish10/knaw -f