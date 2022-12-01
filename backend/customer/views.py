from rest_framework.filters import SearchFilter

from customer.serializers import CustomerSerializer
from core.models import Customer

from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAdminUser


class CustomerViewSet(viewsets.ModelViewSet):
    """Customer api viewset"""
    queryset = Customer.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = CustomerSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name', 'name_kana', 'address', 'tel', 'tel2']
