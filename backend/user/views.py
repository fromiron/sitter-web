from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.line.views import LineOAuth2Adapter
from dj_rest_auth.registration.views import SocialConnectView
from rest_framework.permissions import AllowAny
from django.conf import settings
from allauth.socialaccount.providers.oauth2.client import OAuth2Client


class GoogleAuthView(SocialConnectView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_CALLBACK_URI
    permission_classes = [AllowAny]
    client_class = OAuth2Client


class LineAuthView(SocialConnectView):
    adapter_class = LineOAuth2Adapter
    permission_classes = [AllowAny]
    client_class = OAuth2Client
