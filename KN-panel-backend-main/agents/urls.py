""" The Users URLs """

# Import The Required Packages
from django.urls import path
from . import views

# The List Of URLS
urlpatterns = [

    # Agent Information URL
    path("", views.AgentProfile.as_view(), name="agent_info"),

    # Edit Agent URL
    path("edit/", views.AgentEdit.as_view(), name="agent_edit"),
]
