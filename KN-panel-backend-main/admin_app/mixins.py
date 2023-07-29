""" Create My Mixin Here """
from . import utils
from marzban_urls import STATUS_CODE_FOR_MARZBAN
from rest_framework.permissions import exceptions


class CheckModelIDMixin:
    def check_agent_id(self, request, key, model):
        """ Check The Agent ID Exists """
        key_id = request.POST.get(key, None)

        if not key_id:
            raise exceptions.PermissionDenied(f"There is no {key} in the POST data.")

        # Check The Agent valid or not
        validate_agent=self.is_valid_post_id(key_id, model)

        if not validate_agent.exists():
            raise exceptions.PermissionDenied(f"The provided {key} is not valid.")
        self.pk = key_id
        self.data=validate_agent.first()

    def is_valid_post_id(self, key, model):
        """ Check The Agent Exists with this id """
        data=model.objects.filter(id=key)
        return data

# ---------------------------------
class CheckMarzbanAdmin:
    """ Check an admin is correct in marzban """

    def get_paramter(self, request):
        """ Get The Parameter """
        username = request.POST.get("panel_username")
        password = request.POST.get("panel_password")
        base_url = request.POST.get("panel_url")

        if base_url is None:
            return exceptions.PermissionDenied("Base URL Should Set!")

        is_exsits, response = self.login_marzban(base_url, username, password)
        if not is_exsits:
            raise response

        self.data = response

    def login_marzban(self, base_url, username, password):
        """ Login to Marzban and check the admin user """
        url = utils.return_base_url(base_url)
        json_data, status = utils.login_for_marzban(url, username, password)

        if status.status_code not in STATUS_CODE_FOR_MARZBAN:
            return False, exceptions.PermissionDenied("Username or Password is incorrect")
        return True, json_data
        # raise exceptions.PermissionDenied("Username or Password is incorrect")
