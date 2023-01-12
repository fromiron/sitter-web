from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from core.models import User


class SocialAdapter(DefaultSocialAccountAdapter):

    def pre_social_login(self, request, sociallogin):
        user = sociallogin.user
        if user.id:
            return
        if not user.email:
            return
        try:
            # if user exists, connect the account to the existing account and login
            user = User.objects.get(email=user.email)
            sociallogin.connect(request, user)
        except User.DoesNotExist:
            pass
