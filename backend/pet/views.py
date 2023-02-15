from rest_framework import filters, viewsets, status
from core.pagination import ListPageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.views import APIView

from pet.serializers import (
    PetLikeSerializer,
    PetDislikeSerializer,
    PetSerializer,
    PetStatSerializer,
    PetTypeSerializer,
    PetBreedSerializer,
    PetDetailSerializer,
    PetMemoSerializer,
)
from core.models import Pet, PetType, PetBreed, PetMemo, PetLike, PetDislike


class BasePetViewSet(viewsets.ModelViewSet):
    """base viewset for pet attributes"""

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]


class PetViewSet(BasePetViewSet):
    """Pet api viewset"""

    queryset = Pet.objects.all().order_by("-pk")
    serializer_class = PetSerializer
    filterset_fields = ["name", "sex", "birth", "breed_id", "customer_id", "type_id"]
    search_fields = [
        "name",
        "sex",
        "birth",
        "breed__name",
        "type__name",
        "customer__name",
        "customer__name_kana",
    ]
    pagination_class = ListPageNumberPagination

    def get_serializer_class(self):
        """actionにあうserializerをリターンする"""
        if self.action == "retrieve":
            self.queryset.select_related()
            return PetDetailSerializer
        return self.serializer_class


class PetTypeViewSet(BasePetViewSet):
    """pet type view set"""

    queryset = PetType.objects.all().order_by("-pk")
    serializer_class = PetTypeSerializer
    filterset_fields = ["name"]


class PetBreedViewSet(BasePetViewSet):
    """pet Breed view set"""

    queryset = PetBreed.objects.all().order_by("-pk")
    serializer_class = PetBreedSerializer
    filterset_fields = ["name"]


class PetMemoViewSet(BasePetViewSet):
    """pet memo view set"""

    queryset = PetMemo.objects.all().order_by("-pk")
    serializer_class = PetMemoSerializer
    filterset_fields = ["memo", "pet_id"]
    pagination_class = ListPageNumberPagination


class PetLikeViewSet(BasePetViewSet):
    """pet like view set"""

    queryset = PetLike.objects.all().order_by("-pk")
    serializer_class = PetLikeSerializer
    filterset_fields = ["name"]


class PetDislikeViewSet(BasePetViewSet):
    """pet dislike view set"""

    queryset = PetDislike.objects.all().order_by("-pk")
    serializer_class = PetDislikeSerializer
    filterset_fields = ["name"]


class PetStatViewSet(APIView):
    """pet stat view"""

    serializer_class = PetStatSerializer

    def get(self, request, *args, **kwargs):
        pet_count = Pet.objects.count()
        male_count = Pet.objects.filter(sex=True).count()
        female_count = pet_count - male_count
        dead_count = Pet.objects.filter(death__isnull=False).count()
        type_count = PetType.objects.count()
        breed_count = PetBreed.objects.count()
        data = {
            "pet_count": pet_count,
            "male_count": male_count,
            "female_count": female_count,
            "dead_count": dead_count,
            "type_count": type_count,
            "breed_count": breed_count,
        }
        serializer = PetStatSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
