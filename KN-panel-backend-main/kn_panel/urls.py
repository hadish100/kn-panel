""" This file is for the URLs """

# Import Required Packages
from django.contrib import admin
from django.urls import path, include

from dotenv import load_dotenv
from users.views import LoginPage
from django.conf.urls import url
load_dotenv()
import os
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Test API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://smartbear.com/terms-of-use/",
      contact=openapi.Contact(email="testing@api.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# The List Of URLS
urlpatterns = [
    url(r'^playground/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^docs/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path("admin/", admin.site.urls),
    
    # Login URL
    path("api/login/", LoginPage.as_view(), name="login_page"),

    # Separate The Users URLs for clean code and include them
    path("api/user/", include("users.urls")),
    path("api/admin/", include("users.urls")),
    path("api/agent/", include("agents.urls")),
    path("api/panel/", include("panels.urls"))

]

# Add The Media & Static urls to urlpatterns list
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
