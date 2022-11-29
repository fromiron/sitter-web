from rest_framework import serializers
from core.models import Pet, PetType, PetBreed, PetMemo, PetLike, PetDislike


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


class PetLikeSerializer(serializers.ModelSerializer):
    """Serializer for like."""

    class Meta:
        model = PetLike
        fields = ['id', 'name']
        read_only_fields = ['id']


class PetDislikeSerializer(serializers.ModelSerializer):
    """Serializer for dislike."""

    class Meta:
        model = PetDislike
        fields = ['id', 'name']
        read_only_fields = ['id']


class PetMemoSerializer(serializers.ModelSerializer):
    """Serializer for pet memo."""
    pet_id = serializers.PrimaryKeyRelatedField(
        many=False, queryset=Pet.objects.filter())

    class Meta:
        model = PetMemo
        fields = ['id', 'memo', 'pet_id']
        read_only_fields = ['id']

    def create(self, validated_data):
        """Pet Memoデータ生成"""
        # petインスタンスで変換されたデータをPet.idに
        pet = validated_data.pop('pet_id', None)
        if pet:
            validated_data['pet_id'] = pet.id
        memo = PetMemo.objects.create(**validated_data)
        return memo


class PetSerializer(serializers.ModelSerializer):
    """Pet Serializer"""
    type = PetTypeSerializer(many=False, required=False)
    breed = PetBreedSerializer(many=False, required=False)

    class Meta:
        model = Pet
        fields = [
            'id', 'name', 'sex', 'birth', 'death',
            'type', 'breed', 'customer', 'weight'
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

        type = validated_data.pop('type', None)
        breed = validated_data.pop('breed', None)
        pet = Pet.objects.create(**validated_data)
        if type is not None:
            self._get_or_create_type(type, pet)
        if breed is not None:
            self._get_or_create_breed(breed, pet)

        return pet

    def update(self, instance, validated_data):
        """Pet データ Update."""

        type = validated_data.pop('type', None)
        breed = validated_data.pop('breed', None)
        if type is not None:
            self._get_or_create_type(type, instance)
        if breed is not None:
            self._get_or_create_breed(breed, instance)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class PetDetailSerializer(PetSerializer):
    """Serializer for recipe detail view."""
    memos = PetMemoSerializer(many=True, required=False)
    likes = PetLikeSerializer(many=True, required=False)
    dislikes = PetDislikeSerializer(many=True, required=False)

    class Meta(PetSerializer.Meta):
        fields = PetSerializer.Meta.fields + \
            ['memos', 'likes', 'dislikes']
