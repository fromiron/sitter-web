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
router.register('memos', views.PetMemoViewSet)
router.register('like', views.PetLikeViewSet)
router.register('dislike', views.PetDislikeViewSet)


app_name = 'pet'

urlpatterns = [
    path('', include(router.urls)),
    path('stat', views.PetStatViewSet.as_view())
]
