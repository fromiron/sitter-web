"""
URL mappings for the social api
"""

from django.urls import path
from social.views import (
    GoogleLoginView
)

app_name = 'social'


urlpatterns = [
    path("google/", GoogleLoginView.as_view(), name="google"),
]
