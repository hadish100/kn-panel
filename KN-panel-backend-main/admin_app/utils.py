""" The Useful functions """
import marzban_urls
import requests
from panels.models import Panel
from rest_framework.response import Response


def login_for_marzban(url, username, password):
    """ Login To Marzban """
    data = requests.post(f"{url}{marzban_urls.LOGIN_ACCESS_TOKEN}",
                         data={"username": username, "password": password})
    return data.json(), data


#### ================

def get_the_admin():
    """ Get the admin marzban panel """
    super_admin = Panel.objects.filter(is_main_admin=True).first()
    if super_admin is None:
        return False, Response({"detail": "this user is not admin!"})
    return True, super_admin


# ======================

from urllib.parse import urlparse


def return_base_url(url):
    url = url
    parsed_url = urlparse(url)

    return f"{parsed_url.scheme}://{parsed_url.netloc}"
