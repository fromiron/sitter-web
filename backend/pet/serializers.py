from rest_framework import serializers
from core.models import Pet


class PetSerializer(serializers.ModelSerializer):
    """Pet Serializer"""

    class Meta:
        model = Pet
        fields = [
            'id', 'name', 'sex', 'birth', 'death', 'breed', 'customer', 'type',
        ]
        read_only_fields = ['id']
