from rest_framework import serializers
from pet.serializers import PetSerializer
from core.models import Customer, CustomerMemo


class CustomerMemoSerializer(serializers.ModelSerializer):
    """Serializer for customer memo."""

    customer_id = serializers.PrimaryKeyRelatedField(
        many=False, queryset=Customer.objects.filter()
    )

    class Meta:
        model = CustomerMemo
        fields = ["id", "memo", "customer_id"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        """customer Memoデータ生成"""
        # customerインスタンスで変換されたデータをcustomer.idに
        customer = validated_data.pop("customer_id", None)
        if customer:
            validated_data["customer_id"] = customer.id
        memo = CustomerMemo.objects.create(**validated_data)
        return memo


class CustomerSerializer(serializers.ModelSerializer):
    """Customer Serializer"""

    pets = PetSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Customer
        fields = [
            "id",
            "name",
            "name_kana",
            "tel",
            "tel2",
            "email",
            "line",
            "zipcode",
            "address",
            "pets",
        ]
        read_only_fields = ["id"]


class CustomerDetailSerializer(CustomerSerializer):
    """Serializer for customer detail view."""

    # todo karte追加後Fields追加
    memos = CustomerMemoSerializer(many=True, required=False, read_only=True)

    class Meta(CustomerSerializer.Meta):
        fields = CustomerSerializer.Meta.fields + ["memos"]


class CustomerStatSerializer(serializers.Serializer):
    """dashboardなどに使うStatデータ"""

    total_customers = serializers.IntegerField()
    average_pets = serializers.FloatField()
    recent_created = serializers.IntegerField()


class DeleteCustomersSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField(), min_length=1)
