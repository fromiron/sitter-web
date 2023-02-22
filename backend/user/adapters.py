from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.signals import social_account_updated
from django.dispatch import receiver

from core.models import User


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        同じメールのユーザーがいたらコネクトする
        """
        try:
            email = sociallogin.user.email
            name = sociallogin.user.name
            users = User.objects.filter(email=email)
            if users.exists():
                # If the user already exists, connect the social account to the existing user
                sociallogin.connect(request, users.first())
            else:
                # Otherwise, create a new user account with the email from the social account
                user = User(email=email, name=name)
                user.save()
                sociallogin.connect(request, user)
        except:
            return

    def populate_user(self, request, sociallogin, data):
        """
        ユーザーネームを保存する
        """
        user = super().populate_user(request, sociallogin, data)

        try:
            first_name = data.get("first_name", None)
            last_name = data.get("last_name", None)
            name = data.get("name", None)
            if first_name is not None:
                user.name = f"{first_name}{last_name}".strip()
            else:
                user.name = name
            user.save()
        except:
            return user
        return user
