# The REST Framework Custom Permissions
# Import Required Packages
from rest_framework.permissions import BasePermission


# Start Create Custom Permissions
class IsAgent(BasePermission):
    """ A Login Required Permission """

    def has_object_permission(self, request, view, obj):
        """ Check The User Have Permission to See His/Her Account """
        return bool(request.user.is_active and request.user.is_authenticated)


# ---------------------------------------

class IsAdmin(BasePermission):
    """ Check The User Authenticated Is Admin or Not """

    def has_permission(self, request, view):
        """ Check The User Have Permission As Admin in the list of data """
        return bool(request.user.is_authenticated and request.user.is_superuser)

    def has_object_permission(self, request, view, obj):
        """ Check The User Have Permission As Admin in the Detail of data """
        return bool(request.user.is_authenticated and request.user.is_superuser)
