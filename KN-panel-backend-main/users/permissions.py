# The REST Framework Permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Agents


class IsAgent(BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(request.user.is_active and request.user.is_authenticated)
