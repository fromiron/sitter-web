"""
ユーザーapi serializers
"""


from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext as _
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """user object serializer """
    class Meta:
        model = get_user_model()
        fields = ['email', 'name', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8}
        }

    def create(self, validated_data):
        """create and return a user with encrypted password"""
        return get_user_model().objects.create_user(**validated_data)


class AuthTokenSerializer(serializers.Serializer):
    """auth token serializer"""
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        """validate and return auth data"""
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )
        if not user:
            msg = _('ユーザー情報を確認することができませんでした')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user

        return attrs
