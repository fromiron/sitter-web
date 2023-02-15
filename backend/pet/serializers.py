from rest_framework import serializers

from core.models import Customer, Pet, PetType, PetBreed, PetMemo, PetLike, PetDislike


class CustomerIdNameSerializer(serializers.ModelSerializer):
    """Customer IdName Serializer"""

    class Meta:
        model = Customer
        fields = ["id", "name", "name_kana"]


class PetTypeSerializer(serializers.ModelSerializer):
    """Serializer for type."""

    class Meta:
        model = PetType
        fields = ["id", "name"]
        read_only_fields = ["id"]


class PetBreedSerializer(serializers.ModelSerializer):
    """Serializer for breed."""

    type_id = serializers.PrimaryKeyRelatedField(
        many=False, queryset=PetType.objects.all()
    )

    class Meta:
        model = PetBreed
        fields = ["id", "name", "type_id"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        """Pet Breedデータ生成"""
        pet_type = validated_data.pop("type_id", None)
        return PetBreed.objects.create(**validated_data, type_id=pet_type.id)


class PetLikeSerializer(serializers.ModelSerializer):
    """Serializer for like."""

    class Meta:
        model = PetLike
        fields = ["id", "name"]
        read_only_fields = ["id"]


class PetDislikeSerializer(serializers.ModelSerializer):
    """Serializer for dislike."""

    class Meta:
        model = PetDislike
        fields = ["id", "name"]
        read_only_fields = ["id"]


class PetMemoSerializer(serializers.ModelSerializer):
    """Serializer for pet memo."""

    pet_id = serializers.PrimaryKeyRelatedField(
        many=False, queryset=Pet.objects.filter()
    )

    class Meta:
        model = PetMemo
        fields = ["id", "memo", "pet_id"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        """Pet Memoデータ生成"""
        # petインスタンスで変換されたデータをPet.idに
        pet = validated_data.pop("pet_id", None)
        if pet:
            validated_data["pet_id"] = pet.id
        return PetMemo.objects.create(**validated_data)


class PetSerializer(serializers.ModelSerializer):
    """Pet Serializer"""

    type = PetTypeSerializer(many=False, required=False)
    breed = PetBreedSerializer(many=False, required=False)
    customer = CustomerIdNameSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), write_only=True
    )
    image = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Pet
        fields = [
            "id",
            "name",
            "sex",
            "birth",
            "death",
            "type",
            "breed",
            "customer",
            "customer_id",
            "weight",
            "image",
            "thumbnail",
        ]
        read_only_fields = ["id"]

    def get_image(self, obj):
        if bool(obj.image):
            return self.context["request"].build_absolute_uri(obj.image.url)
        return None

    def get_thumbnail(self, obj):
        if bool(obj.thumbnail):
            return self.context["request"].build_absolute_uri(obj.thumbnail.url)
        return None

    def _get_or_create_type(self, type, pet):
        """同じTypeがあったらリターン、なかったら生成してリターン"""
        obj, _ = PetType.objects.get_or_create(**type)
        pet.type = obj

    def _get_or_create_breed(self, breed, pet):
        """同じbreedがあったらリターン、なかったら生成してリターン"""
        type = breed.pop("type_id")
        obj, _ = PetBreed.objects.get_or_create(**breed, type_id=type.id)
        pet.breed = obj

    def create(self, validated_data):
        """Pet データ生成"""
        customer = validated_data.pop("customer_id", None)
        type = validated_data.pop("type", None)
        breed = validated_data.pop("breed", None)
        pet = Pet.objects.create(**validated_data, customer_id=customer.id)
        if type is not None:
            self._get_or_create_type(type, pet)
        if breed is not None:
            self._get_or_create_breed(breed, pet)
        pet.save()
        return pet

    def update(self, instance, validated_data):
        """Pet データ Update."""
        customer = validated_data.pop("customer_id", None)
        type = validated_data.pop("type", None)
        breed = validated_data.pop("breed", None)
        if customer is not None:
            validated_data["customer_id"] = customer.id
        if type is not None:
            self._get_or_create_type(type, instance)
        if breed is not None:
            self._get_or_create_breed(breed, instance)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class PetDetailSerializer(PetSerializer):
    """Serializer for pet detail view."""

    memos = PetMemoSerializer(many=True, required=False)
    likes = PetLikeSerializer(many=True, required=False)
    dislikes = PetDislikeSerializer(many=True, required=False)

    class Meta(PetSerializer.Meta):
        fields = PetSerializer.Meta.fields + ["memos", "likes", "dislikes"]


class PetStatSerializer(serializers.Serializer):
    pet_count = serializers.IntegerField()
    dead_count = serializers.IntegerField()
    male_count = serializers.IntegerField()
    female_count = serializers.IntegerField()
    dead_count = serializers.IntegerField()
    type_count = serializers.IntegerField()
    breed_count = serializers.IntegerField()
