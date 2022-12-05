"""
URL mappings for the social api
"""

from django.urls import path

from user.views import CreateUserView


app_name = 'user'


urlpatterns = [
    path('create/', CreateUserView.as_view(), name='create'),
]
