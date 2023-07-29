""" Create Our Views In This file """
import django.db.utils
import requests
from django.contrib.auth.models import User
from rest_framework.generics import (
    CreateAPIView,
    UpdateAPIView,
    ListAPIView,
    DestroyAPIView
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
# Custom Imports
from agents.models import Agent
from . import serializers, mixins, utils
from admin_app import permissions
from panels.models import Panel
import os
from celery import shared_task
import time
from agents.models import Agent, Panel
# ----------------------------------
""" Admin Access to Agent Information """


class AdminAgentCreate(CreateAPIView):
    """ Create The Agent With Admin User """
    serializer_class = serializers.AgentSerializer
    queryset = Agent.objects.all()
    permission_classes = [permissions.IsAdmin]

    def post(self, request, *args, **kwargs):
        """ Handle the POST Request """
        get_username = request.POST.get("username")
        get_user = User.objects.filter(username=get_username).first()
        if get_user is not None:
            return Response({"Message": "User with this username exists!"}, status=status.HTTP_400_BAD_REQUEST)
        return super().post(request, *args, **kwargs)


# ---------------------------------------

class AdminAgentUpdate(mixins.CheckModelIDMixin, UpdateAPIView):
    """ Edit The Agent With Admin User """
    serializer_class = serializers.AgentSerializer
    permission_classes = [permissions.IsAdmin]

    def put(self, request, *args, **kwargs):
        """ Handle The PUT Request """
        self.check_agent_id(request, "agent_id", Agent)
        kwargs['partial'] = True

        username = request.POST.get("username")
        password = request.POST.get("password")
        user = self.get_queryset().first().user
        try:
            if username is not None:
                user.username = username
            elif password is not None:
                user.password = password
            user.save()
        except django.db.utils.IntegrityError:
            return Response({"Message": "User With This Username exists!"})
        return super().put(request, *args, **kwargs)

    def get_queryset(self):
        """ Set the agent data for this view """
        self.kwargs["pk"] = self.pk
        return Agent.objects.filter(id=self.pk)


# ------------------------------------------------------

class AdminAgentProfiles(ListAPIView):
    """ View Agent With Admin User """
    serializer_class = serializers.AgentSerializer
    permission_classes = [permissions.IsAdmin]
    queryset = Agent.objects.all()


# ------------------------------------------------------
@api_view(["PUT"])
def disable_agent(request):
    """ This View Is For Disable Agent """
    get_agentID = request.POST.get("agent_id")
    get_agent = Agent.objects.filter(id=get_agentID).first()
    if get_agent is not None:
        get_agent.disable = True
        get_agent.user.is_active = False
        get_agent.save()
        return Response({"Message": "Done!"}, status=status.HTTP_200_OK)
    else:
        return Response({"Message": "Agent Not Found!"}, status=status.HTTP_404_NOT_FOUND)


# ------------------------------------------------------
class AdminAgentDelete(mixins.CheckModelIDMixin, DestroyAPIView):
    """ Delete Agent With Admin User """
    serializer_class = serializers.AgentSerializer
    permission_classes = [permissions.IsAdmin]

    def delete(self, request, *args, **kwargs):
        """ Handle The Delete Method """
        self.check_agent_id(request, "agent_id", Agent)
        return super().delete(request, *args, **kwargs)

    def get_queryset(self):
        """ Set the agent data for this view """
        get_pk = self.request.POST.get("agent_id")
        self.kwargs['pk'] = get_pk
        get_agent = Agent.objects.filter(id=get_pk)
        return get_agent

