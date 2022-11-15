"""
URL mappings for pet
"""

from django.urls import path, include
from pet import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('pet', views.PetViewSet)

app_name = 'pet'

urlpatterns = [
    path('', include(router.urls))
]
