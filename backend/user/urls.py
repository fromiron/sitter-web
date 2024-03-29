"""
URL mappings for auth
"""

from dj_rest_auth.registration.views import (
    VerifyEmailView,
    ConfirmEmailView,
)
from django.urls import path, include, re_path

from user.views import GoogleAuthView, LineAuthView

app_name = "user"

urlpatterns = [
    path("", include("dj_rest_auth.urls")),
    path("registration/", include("dj_rest_auth.registration.urls")),
    # 有効なメールか確認する
    re_path(
        r"^account-confirm-email/$",
        VerifyEmailView.as_view(),
        name="account_email_verification_sent",
    ),
    # ユーザーがクリックしたリンクを確認
    re_path(
        r"^account-confirm-email/(?P<key>[-:\w]+)/$",
        ConfirmEmailView.as_view(),
        name="account_confirm_email",
    ),
    path("google/", GoogleAuthView.as_view(), name="google_login"),
    path("line/", LineAuthView.as_view(), name="line_login"),
]
