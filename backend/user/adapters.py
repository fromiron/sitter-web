from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

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
                sociallogin.connect(request, users.first())
            else:
                user = User(email=email, name=name)
                user.save()
                sociallogin.connect(request, user)
        except Exception as e:
            print(f"Exception occurred:\n{e}")
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
        except Exception as e:
            print(f"Exception occurred:\n{e}")
            return user
        return user
