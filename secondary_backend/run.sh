# install
docker pull hadish10/knsb && docker run -v /var/lib/marzban:/var/lib/marzban -v /opt/marzban:/opt/marzban -p 7002:7002 -d --restart unless-stopped hadish10/knsb
# update
# ???