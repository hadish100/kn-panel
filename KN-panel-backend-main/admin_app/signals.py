# Signals for project

from django.db.models.signals import post_save
from .utils import *


# Start Create The Signal Section
def set_base_url(sender, created, instance, **kwargs):
    """ Filter the base url from the panel url dashboard """
    if created:
        url = return_base_url(instance.panel_url)
        instance.panel_base_url = url
        instance.save()


post_save.connect(set_base_url, Panel)


def set_user_token(sender, created, instance, **kwargs):
    """ Set The user token """
    if created:
        data, status = login_for_marzban(instance.panel_base_url, instance.panel_username, instance.panel_password)
        instance.panel_user_token = data['access_token']
        instance.save()


post_save.connect(set_user_token, Panel)
