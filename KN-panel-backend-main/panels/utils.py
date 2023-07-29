""" Create Needed function """
import requests
import marzban_urls



def login_for_marzban(url, username, password):
    """ Login To Marzban """
    data = requests.post(f"{url}{marzban_urls.LOGIN_ACCESS_TOKEN}",
                         data={"username": username, "password": password})
    return data.json(), data


# Create the functions for short code
def short_send_get_request(url, headers=None, data=None, json=None):
    """ Send The GET Request to the specific url """
    data = requests.get(url, headers=headers, data=data, json=json)
    return data


def short_send_post_request(url, headers=None, data=None, json=None):
    """ Send The POST Request to the specific url """
    data = requests.post(url, headers=headers, data=data, json=json)
    return data


def short_send_put_request(url, headers=None, data=None, json=None):
    """ Send The PUT Request to the specific url """
    data = requests.put(url, headers=headers, data=data, json=json)
    return data


def short_send_delete_request(url, headers=None, data=None, json=None):
    """ Send The DELETE Request to the specific url """
    data = requests.delete(url, headers=headers, data=data, json=json)
    return data
