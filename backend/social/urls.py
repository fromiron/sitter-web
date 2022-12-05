"""
URL mappings for the social api
"""

from django.urls import path
from social.views import (
    GoogleAuthView
)

app_name = 'social'


urlpatterns = [
    path("google/", GoogleAuthView.as_view(), name="google"),
]
