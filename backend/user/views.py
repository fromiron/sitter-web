"""
Views for the user API
"""

from user.serializers import UserSerializer, AuthTokenSerializer
from rest_framework import generics, authentication, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.authtoken.models import Token
from rest_framework.response import Response


class CreateUserView(generics.CreateAPIView):
    """ユーザー生成"""
    serializer_class = UserSerializer


class CreateTokenView(ObtainAuthToken):
    """トークン生成"""
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'access_token': token.key,
            'id': user.pk,
            'name': user.name,
            'email': user.email
        })


class ManageUserView(generics.RetrieveUpdateAPIView):
    """認証されたユーザー管理"""
    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
