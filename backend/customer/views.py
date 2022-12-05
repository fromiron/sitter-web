from rest_framework.filters import SearchFilter
from core.pagination import ListPageNumberPagination

from customer.serializers import CustomerSerializer
from core.models import Customer

from rest_framework import viewsets


class CustomerViewSet(viewsets.ModelViewSet):
    """Customer api viewset"""
    queryset = Customer.objects.all().order_by('-pk')
    serializer_class = CustomerSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name', 'name_kana', 'address', 'tel', 'tel2']
    pagination_class = ListPageNumberPagination
