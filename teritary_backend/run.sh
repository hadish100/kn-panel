# install
docker pull hadish10/kntb && docker run -v /var/lib/marzban:/var/lib/marzban -v /opt/marzban:/opt/marzban --network="host" -p 7002:7002 -d --restart always hadish10/kntb
# update
docker stop $(docker ps -a -q --filter "ancestor=hadish10/kntb") && docker rm $(docker ps -a -q --filter "ancestor=hadish10/kntb") && docker rmi hadish10/kntb -f && docker pull hadish10/kntb && docker run -v /var/lib/marzban:/var/lib/marzban -v /opt/marzban:/opt/marzban --network="host" -p 7002:7002 -d --restart always hadish10/kntb