# install
docker pull hadish10/knsb && docker run -v /var/lib/marzban:/var/lib/marzban -v /opt/marzban:/opt/marzban -p 7002:7002 -d --restart always hadish10/knsb
# update
# ???