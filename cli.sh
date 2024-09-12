#!/bin/bash

case "$1" in
    start)
        cd /root/knp && docker compose up -d
        ;;
    stop)
        cd /root/knp && docker compose down
        ;;
    restart)
        cd /root/knp && docker compose down && docker compose up -d
        ;;
    logs)
        cd /root/knp && docker logs -f knp_backend --tail 100
        ;;
    update)
        cd /root/knp && git pull && docker compose build && docker docker compose down && docker compose up -d
        ;;
    *)
        echo "Usage: knp {start|stop|restart|logs|update}"
        exit 1
        ;;
esac
