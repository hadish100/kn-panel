""" Create My Mixin Here """

# Import Required Packages
from panels.models import Panel
from .models import Agent
from rest_framework.permissions import exceptions
import requests
import marzban_urls
from admin_app.utils import login_for_marzban
from rest_framework.response import Response


# Start Creating the Mixins
class CheckAgentExists:
    """ Check The Agent Exists in Database """

    def check_the_user(self, request):
        """ Check The Agent Exists with The Authenticated User """
        agent = Agent.objects.filter(user=request.user, disable=False).first()
        if agent is None:
            raise exceptions.PermissionDenied("Agent Not Found or agent Disabled With This User!")
        elif agent is not None:
            if agent.volume == 0:
                raise exceptions.PermissionDenied("Agent don't have any traffic to give them to the user")
        elif request.user.is_superuser:
            raise exceptions.PermissionDenied("Admin can not create a user for agents!")
        self.agent = agent

    def check_panel(self, request, country):
        """ Check The agent can create a user with the given country """
        if country is None:
            raise exceptions.PermissionDenied("Country Should Set!")
        # Get the agent
        agent = Agent.objects.filter(user=request.user).first()
        for panel in agent.panels.all():
            if country != panel.panel_country:
                raise exceptions.PermissionDenied(
                    f"You don't have permission to create this user to another panel")
            else:
                self.panel = panel
                break

    def update_panel(self, send_request_func, panel, url, header=None, json=None):
        """ Check The Marzban token exists! """
        data = send_request_func(url, header, json=json)
        if data.status_code not in marzban_urls.STATUS_CODE_FOR_MARZBAN and data.status_code == 401:
            data, response = login_for_marzban(panel.panel_base_url, panel.panel_username, panel.panel_password)
            panel.panel_user_token = data['access_token']
            panel.save()
            data = send_request_func(url, header, json=json)
            return data
        else:
            return data

# ================================
