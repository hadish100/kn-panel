""" Create Our Views In This file """

# Import Required Packages
from agents.mixins import CheckAgentExists

from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from .mixins import *


# Start The Views Section

class LoginPage(TokenObtainPairView):
    """ Overwrite Just Serializer Class from Access Token View """
    serializer_class = serializers.TokenObtainPairSerializer

