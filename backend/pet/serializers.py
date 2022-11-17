from rest_framework import serializers
from core.models import Pet, PetType, PetBreed


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


class PetSerializer(serializers.ModelSerializer):
    """Pet Serializer"""
    type = PetTypeSerializer(required=False)
    breed = PetBreedSerializer(required=False)

    class Meta:
        model = Pet
        fields = [
            'id', 'name', 'sex', 'birth', 'death', 'breed', 'customer', 'type',
        ]
        read_only_fields = ['id']

    def _get_or_create_type(self, type, pet):
        """同じTypeがあったらリターン、なかったら生成してリターン"""
        obj, _ = PetType.objects.get_or_create(**type)
        pet.type = obj

    def _get_or_create_breed(self, breed, pet):
        """同じbreedがあったらリターン、なかったら生成してリターン"""
        obj, _ = PetBreed.objects.get_or_create(**breed)
        pet.breed = obj

    def create(self, validated_data):
        """Pet データ生成"""

        type = validated_data.pop('type', {})
        breed = validated_data.pop('breed', {})
        pet = Pet.objects.create(**validated_data)
        if type is not None:
            self._get_or_create_type(type, pet)
        if breed is not None:
            self._get_or_create_breed(breed, pet)

        return pet
