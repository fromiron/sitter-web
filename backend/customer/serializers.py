from rest_framework import serializers
from core.models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    """Customer Serializer"""

    class Meta:
        model = Customer
        fields = [
            'id', 'name', 'name_kana', 'tel', 'tel2', 'address',
        ]
        read_only_fields = ['id']
