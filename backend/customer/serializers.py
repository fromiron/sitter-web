from rest_framework import serializers
from pet.serializers import PetSerializer
from core.models import Customer, CustomerMemo


class CustomerSerializer(serializers.ModelSerializer):
    """Customer Serializer"""

    class Meta:
        model = Customer
        fields = ['id', 'name', 'name_kana', 'tel', 'tel2', 'address']
        read_only_fields = ['id']


class CustomerMemoSerializer(serializers.ModelSerializer):
    """Serializer for customer memo."""
    customer_id = serializers.PrimaryKeyRelatedField(
        many=False, queryset=Customer.objects.filter())

    class Meta:
        model = CustomerMemo
        fields = ['id', 'memo', 'customer_id']
        read_only_fields = ['id']

    def create(self, validated_data):
        """customer Memoデータ生成"""
        # customerインスタンスで変換されたデータをcustomer.idに
        customer = validated_data.pop('customer_id', None)
        if customer:
            validated_data['customer_id'] = customer.id
        memo = CustomerMemo.objects.create(**validated_data)
        return memo


class CustomerDetailSerializer(CustomerSerializer):
    """Serializer for customer detail view."""
    memos = CustomerMemoSerializer(many=True, required=False)
    pets = PetSerializer(many=True, required=False)

    class Meta(CustomerSerializer.Meta):
        fields = CustomerSerializer.Meta.fields + \
            ['memos', 'pets']
