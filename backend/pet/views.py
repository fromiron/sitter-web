from pet.serializers import (
    PetSerializer, PetTypeSerializer,
    PetBreedSerializer, PetDetailSerializer, PetMemoSerializer
)
from core.models import Pet, PetType, PetBreed, PetMemo

from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAdminUser


class PetViewSet(viewsets.ModelViewSet):
    """Pet api viewset"""
    queryset = Pet.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = PetSerializer

    def get_serializer_class(self):
        """actionにあうserializerをリターンする"""
        if self.action == 'retrieve':
            self.queryset.select_related()
            return PetDetailSerializer
        return self.serializer_class


class PetTypeViewSet(viewsets.ModelViewSet):
    """pet type view set"""
    queryset = PetType.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = PetTypeSerializer


class PetBreedViewSet(viewsets.ModelViewSet):
    """pet Breed view set"""
    queryset = PetBreed.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = PetBreedSerializer


class PetMemoViewSet(viewsets.ModelViewSet):
    """pet memo view set"""
    queryset = PetMemo.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = PetMemoSerializer
