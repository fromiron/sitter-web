from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from core.models import Customer, CustomerMemo
from core.pagination import ListPageNumberPagination
from customer.serializers import (
    CustomerDetailSerializer,
    CustomerMemoSerializer,
    CustomerSerializer,
    CustomerStatSerializer,
)

from django.db.models import Avg, Count


class BaseCustomerViewSet(viewsets.ModelViewSet):
    """base viewset for customer attributes"""

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    pagination_class = ListPageNumberPagination


class CustomerViewSet(BaseCustomerViewSet):
    """Customer api viewset"""

    queryset = Customer.objects.all().order_by("-pk")
    serializer_class = CustomerSerializer
    search_fields = ["id", "name", "name_kana", "zipcode", "address", "tel", "tel2"]

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


class CustomerStatViewSet(APIView):
    """customer stat view"""

    serializer_class = CustomerStatSerializer

    def get(self, request, *args, **kwargs):
        six_months_ago = timezone.now() - timedelta(days=180)
        aggregate_result = Customer.objects.annotate(num_pets=Count("pets")).aggregate(
            Avg("num_pets")
        )
        total_customers = Customer.objects.count()
        average_pets = aggregate_result.get("num_pets__avg")
        recent_created = Customer.objects.filter(created__gte=six_months_ago).count()
        data = {
            "total_customers": total_customers,
            "average_pets": average_pets,
            "recent_created": recent_created,
        }
        serializer = CustomerStatSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
