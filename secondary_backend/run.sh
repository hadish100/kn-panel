# install
docker pull hadish10/knsb && docker run -v /var/lib/marzban:/var/lib/marzban -v /opt/marzban:/opt/marzban -p 7002:7002 -d --restart always hadish10/knsb
# update
docker stop $(docker ps -a -q --filter "ancestor=hadish10/knsb") && docker rm $(docker ps -a -q --filter "ancestor=hadish10/knsb") && docker rmi hadish10/knsb -f && docker pull hadish10/knsb && docker run -v /var/lib/marzban:/var/lib/marzban -v /opt/marzban:/opt/marzban -p 7002:7002 -d --restart always hadish10/knsb