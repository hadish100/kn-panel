""" The Users URLs """

# Import The Required Packages
from django.urls import path
from . import views

# The List Of URLS
urlpatterns = [

    # Create User URL
    path("create/", views.CreateUser.as_view(), name="create_user_view")
]
