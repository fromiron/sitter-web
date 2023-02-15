from core.pagination import ListPageNumberPagination
from customer.serializers import (
    CustomerDetailSerializer,
    CustomerMemoSerializer,
    CustomerSerializer,
)
from core.models import Customer, CustomerMemo

from rest_framework import viewsets
from rest_framework import filters


class BaseCustomerViewSet(viewsets.ModelViewSet):
    """base viewset for customer attributes"""

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    pagination_class = ListPageNumberPagination


class CustomerViewSet(BaseCustomerViewSet):
    """Customer api viewset"""

    queryset = Customer.objects.all().order_by("-pk")
    serializer_class = CustomerSerializer
    search_fields = ["id", "name", "name_kana", "address", "tel", "tel2"]

    def get_serializer_class(self):
        """actionにあうserializerをリターンする"""
        if self.action == "retrieve":
            self.queryset.prefetch_related()
            return CustomerDetailSerializer
        else:
            return CustomerSerializer


class CustomerMemoViewSet(BaseCustomerViewSet):
    """pet memo view set"""

    queryset = CustomerMemo.objects.all().order_by("-pk")
    serializer_class = CustomerMemoSerializer
    filterset_fields = ["memo", "customer_id"]
