"""
URL mappings for pet
"""

from django.urls import path, include
from pet import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('pets', views.PetViewSet)
router.register('types', views.PetTypeViewSet)
router.register('breeds', views.PetBreedViewSet)
router.register('memo', views.PetMemoViewSet)

app_name = 'pet'

urlpatterns = [
    path('', include(router.urls))
]
