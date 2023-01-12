from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialConnectView
from rest_framework.permissions import AllowAny


class GoogleAuthView(SocialConnectView):
    adapter_class = GoogleOAuth2Adapter
    permission_classes = [AllowAny]
    client_class = OAuth2Client
