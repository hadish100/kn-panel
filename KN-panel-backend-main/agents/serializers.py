""" Create The Serializers In This File """

# Import The required Things
from rest_framework import serializers
from django.contrib.auth.models import User

# Custom Apps Import
from .models import Agent


# -----------------------------

class AgentSerializer(serializers.ModelSerializer):
    """ Serialize The Agent Data for admin """
    username = serializers.CharField(source="user.username")
    password = serializers.CharField(source="user.password")

    class Meta:
        model = Agent
        fields = ["id", "agent_name", "username", "password", "volume", "maximum_day", "country", "prefix", "disable",
                  "weight_dividable", "user_count"]
        read_only_fields = ["id"]


# ------------------------------------
class AgentSerializerUser(serializers.ModelSerializer):
    """ Serialize The Agent Data For Agent """

    class Meta:
        model = User
        fields = ["username", "password"]
        extra_kwargs = {field: {'required': False} for field in fields}
