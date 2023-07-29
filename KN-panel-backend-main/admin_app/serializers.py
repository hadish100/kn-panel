""" Create The Serializers In This File """

# Import The required Things
from rest_framework import serializers
from django.contrib.auth.models import User
import requests

# Custom Apps Import
from agents.models import Agent
from panels.models import Panel
import marzban_urls
import os
from celery import shared_task


# -----------------------------

class UserSerializer(serializers.ModelSerializer):
    """ Serialize The Agent Data For Agent """

    class Meta:
        model = User
        fields = ["username", "password"]


class AgentSerializer(serializers.ModelSerializer):
    """ Serialize The Agent Data for admin """
    username = serializers.CharField(source="user.username")
    password = serializers.CharField(source="user.password")
    user = UserSerializer(many=False, required=False)

    class Meta:
        model = Agent
        fields = ["id", "agent_name", "volume", "maximum_day", "country", "prefix", "user", "username", "password"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        """ Handle The Create Method and config for relationship in Serializer """
        print(validated_data)
        create_user = User.objects.create(username=validated_data['user']['username'],
                                          password=validated_data['user']['password'])
        create_agent = Agent.objects.create(user=create_user, agent_name=validated_data["agent_name"],
                                            country=validated_data["country"], prefix=validated_data["prefix"])
        return create_agent

    def update(self, instance, validated_data):
        """ Handle The Create Method and config for relationship in Serializer """
        request = self.context['request']

        username = request.POST.get("username")
        password = request.POST.get("password")
        validated_data['username'] = username
        validated_data['password'] = password
        instance.save()
        instance.user.save()
        instance = super().update(instance, validated_data)

        return instance


# =====================================================



""" Serializers For Panel Model """


class PanelSerializer(serializers.ModelSerializer):
    """ Serialize The Panel Data """

    class Meta:
        model = Panel
        fields = "__all__"
        extra_kwargs = {field: {'required': False} for field in fields}
