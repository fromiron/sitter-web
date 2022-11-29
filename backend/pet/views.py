from pet.serializers import (
    PetLikeSerializer,
    PetDislikeSerializer, PetSerializer, PetTypeSerializer,
    PetBreedSerializer, PetDetailSerializer, PetMemoSerializer
)
from core.models import Pet, PetType, PetBreed, PetMemo, PetLike, PetDislike

from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAdminUser


class BasePetViewSet(mixins.DestroyModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.CreateModelMixin,
                     viewsets.GenericViewSet):
    """base viewset for pet attributes"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]


class PetViewSet(BasePetViewSet):
    """Pet api viewset"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer

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


class PetBreedViewSet(BasePetViewSet):
    """pet Breed view set"""
    queryset = PetBreed.objects.all()
    serializer_class = PetBreedSerializer


class PetMemoViewSet(BasePetViewSet):
    """pet memo view set"""
    queryset = PetMemo.objects.all()
    serializer_class = PetMemoSerializer


class PetLikeViewSet(BasePetViewSet):
    """pet like view set"""
    queryset = PetLike.objects.all()
    serializer_class = PetLikeSerializer


class PetDislikeViewSet(BasePetViewSet):
    """pet dislike view set"""
    queryset = PetDislike.objects.all()
    serializer_class = PetDislikeSerializer
