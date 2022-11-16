from rest_framework import serializers
from core.models import Pet, PetType, PetBreed


class PetSerializer(serializers.ModelSerializer):
    """Pet Serializer"""

    class Meta:
        model = Pet
        fields = [
            'id', 'name', 'sex', 'birth', 'death', 'breed', 'customer', 'type',
        ]
        read_only_fields = ['id']


class PetTypeSerializer(serializers.ModelSerializer):
    """Serializer for type."""
    class Meta:
        model = PetType
        fields = ['id', 'name']
        read_only_fields = ['id']


class PetBreedSerializer(serializers.ModelSerializer):
    """Serializer for breed."""
    class Meta:
        model = PetBreed
        fields = ['id', 'name']
        read_only_fields = ['id']
