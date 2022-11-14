"""
URL mappings for customer
"""

from django.urls import path, include
from customer import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('customers', views.CustomerViewSet)

app_name = 'customer'

urlpatterns = [
    path('', include(router.urls))
]
