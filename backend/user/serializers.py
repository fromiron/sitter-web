"""
ユーザーapi serializers
"""
from core.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'is_active', 'is_staff', 'last_login']
