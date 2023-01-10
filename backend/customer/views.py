from core.pagination import ListPageNumberPagination
from customer.serializers import CustomerDetailSerializer, CustomerMemoSerializer, CustomerSerializer
from core.models import Customer, CustomerMemo

from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend


class BasePetViewSet(viewsets.ModelViewSet):
    """base viewset for pet attributes"""
    filter_backends = [DjangoFilterBackend]
    pagination_class = ListPageNumberPagination


class CustomerViewSet(BasePetViewSet):
    """Customer api viewset"""
    queryset = Customer.objects.all().order_by('-pk')
    serializer_class = CustomerSerializer
    search_fields = ['id', 'name', 'name_kana', 'address', 'tel', 'tel2']
    ordering_fields = ['id, name', 'name_kana', 'address', 'tel', 'tel2']

    def get_serializer_class(self):
        """actionにあうserializerをリターンする"""
        if self.action == 'retrieve':
            self.queryset.prefetch_related()
            return CustomerDetailSerializer
        else:
            return CustomerSerializer

    def get_queryset(self):
        sort = self.request.query_params.get("sort", None)
        if sort == 'ASC':
            return Customer.objects.all()
        else:
            return Customer.objects.all().order_by('-pk')


class CustomerMemoViewSet(BasePetViewSet):
    """pet memo view set"""
    queryset = CustomerMemo.objects.all().order_by('-pk')
    serializer_class = CustomerMemoSerializer
    filterset_fields = ['memo', 'customer_id']
