from pet.serializers import PetSerializer
from core.models import Pet

from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAdminUser


class PetViewSet(viewsets.ModelViewSet):
    """Pet api viewset"""
    queryset = Pet.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = PetSerializer
