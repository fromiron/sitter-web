from django_filters.rest_framework import DjangoFilterBackend

from pet.serializers import (
    PetLikeSerializer,
    PetDislikeSerializer, PetSerializer, PetTypeSerializer,
    PetBreedSerializer, PetDetailSerializer, PetMemoSerializer
)
from core.models import Pet, PetType, PetBreed, PetMemo, PetLike, PetDislike

from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAdminUser


class BasePetViewSet(viewsets.ModelViewSet):
    """base viewset for pet attributes"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]


class PetViewSet(BasePetViewSet):
    """Pet api viewset"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    filterset_fields = ['name', 'sex', 'birth',
                        'breed_id', 'customer_id', 'type_id']

    def get_serializer_class(self):
        """actionにあうserializerをリターンする"""
        if self.action == 'retrieve':
            self.queryset.select_related()
            return PetDetailSerializer
        return self.serializer_class


class PetTypeViewSet(BasePetViewSet):
    """pet type view set"""
    queryset = PetType.objects.all()
    serializer_class = PetTypeSerializer
    filterset_fields = ['name']


class PetBreedViewSet(BasePetViewSet):
    """pet Breed view set"""
    queryset = PetBreed.objects.all()
    serializer_class = PetBreedSerializer
    filterset_fields = ['name']


class PetMemoViewSet(BasePetViewSet):
    """pet memo view set"""
    queryset = PetMemo.objects.all()
    serializer_class = PetMemoSerializer
    filterset_fields = ['memo', 'pet_id']


class PetLikeViewSet(BasePetViewSet):
    """pet like view set"""
    queryset = PetLike.objects.all()
    serializer_class = PetLikeSerializer
    filterset_fields = ['name']


class PetDislikeViewSet(BasePetViewSet):
    """pet dislike view set"""
    queryset = PetDislike.objects.all()
    serializer_class = PetDislikeSerializer
    filterset_fields = ['name']
