""" Create Our Views In This file """
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response

from . import permissions, serializers
from .mixins import *
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView, UpdateAPIView
)
from .models import Agent
from rest_framework.permissions import IsAuthenticated


# Start The Views Section
# ----------------------------------

class AgentProfile(RetrieveAPIView):
    """ Allow agent to see his/her profile information """
    serializer_class = serializers.AgentSerializer
    permission_classes = [permissions.IsAgent]

    def get(self, request, format=None, **kwargs):
        """ Handle The GET Request and Check The Agent is valid or not! """
        try:
            get_agent = Agent.objects.filter(user=request.user).first()
            print(get_agent.id)
        except:
            return Response({"Message": "No User Found!"}, status=status.HTTP_404_NOT_FOUND)
        return super().get(request, format, **kwargs)

    def get_queryset(self):
        """ Return The Data """
        get_user = self.request.user
        agent = Agent.objects.filter(user=get_user)
        self.kwargs['pk'] = agent.first().id
        return agent
