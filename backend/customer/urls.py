"""
URL mappings for customer
"""

from django.urls import path, include
from customer import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("customers", views.CustomerViewSet)
router.register("memos", views.CustomerMemoViewSet)

app_name = "customer"

urlpatterns = [
    path("", include(router.urls)),
    path("stat", views.CustomerStatViewSet.as_view(), name="customer-stat"),
]
