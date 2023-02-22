"""
ユーザーapiテスト
"""
from django.conf import settings
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from allauth.account.models import EmailAddress

from rest_framework.test import APIClient
from rest_framework import status

# url reverse name参照
# https://github.com/iMerica/dj-rest-auth/blob/master/dj_rest_auth/registration/urls.py
CREATE_USER_URL = reverse("user:rest_register")
# url reverse name参照
# https://github.com/iMerica/dj-rest-auth/blob/master/dj_rest_auth/urls.py
LOGIN_URL = reverse("user:rest_login")
ME_URL = reverse("user:rest_user_details")
VERIFY_EMAIL_URL = reverse("user:rest_verify_email")
EMAIL_VERIFICATION_SENT_URL = reverse("user:account_email_verification_sent")


def create_user(**params):
    """ユーザー生成、リターン"""
    return get_user_model().objects.create_user(**params)


class PublicUserApiTests(TestCase):
    """Public user apiテスト"""

    def setUp(self):
        self.client = APIClient()
        settings.ACCOUNT_EMAIL_VERIFICATION = None

    def test_create_user_success(self):
        """ユーザー生成成功テスト"""
        payload = {
            "email": "test@example.com",
            "username": "testuser",
            "password1": "passsword123",
            "password2": "passsword123",
        }
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # user = get_user_model().objects.get(email=payload['email'])
        # self.assertTrue(user.check_password(payload['password']))
        # self.assertIn('access_token', res.data)
        # self.assertIn('user', res.data)
        # self.assertNotIn('password', res.data)

    def test_create_user_email_exists_error(self):
        """ユーザー生成中、メール中腹エラーテスト"""
        userdata = {
            "email": "test@example.com",
            "name": "testuser",
            "password": "passsword123",
        }
        payload = {
            "email": "test@example.com",
            "username": "testuser",
            "password1": "passsword123",
            "password2": "passsword123",
        }
        create_user(**userdata)
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_mail_is_null_error(self):
        """ユーザー生成中、メール未入力エラーテスト"""
        payload = {
            "email": "",
            "name": "testuser",
            "password1": "passsword123",
            "password2": "passsword123",
        }
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(email=payload["email"]).exists()
        self.assertFalse(user_exists)

    def test_create_user_name_is_null_error(self):
        """ユーザー生成中、名前未入力エラーテスト"""
        payload = {
            "email": "test@example.com",
            "username": "",
            "password1": "passsword123",
            "password2": "passsword123",
        }
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(email=payload["email"]).exists()
        self.assertFalse(user_exists)

    def test_create_user_password_too_short_error(self):
        """ユーザー生成中、passwordが短いとき(8文字未満)エラーテスト"""
        payload = {
            "email": "test@example.com",
            "name": "testuser",
            "password1": "passs",
            "password2": "passs",
        }
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(email=payload["email"]).exists()
        self.assertFalse(user_exists)

    def test_login_not_verified_user(self):
        """認証されてないメールユーザーログインテスト"""
        db_user_data = {
            "name": "testuser2",
            "email": "test@example.com",
            "password": "password123",
        }
        create_user(**db_user_data)
        payload = {"email": db_user_data["email"], "password": db_user_data["password"]}
        res = self.client.post(LOGIN_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["user"]["is_active"])
        self.assertFalse(res.data["user"]["is_staff"])

    def test_login_verified_user(self):
        """ユーザーtoken生成テスト"""
        db_user_data = {
            "name": "testuser",
            "email": "test@example.com",
            "password": "password123",
            "is_active": True,
            "is_staff": True,
        }
        user = create_user(**db_user_data)
        EmailAddress.objects.create(
            email=db_user_data["email"], user=user, verified=True
        )

        payload = {"email": db_user_data["email"], "password": db_user_data["password"]}
        res = self.client.post(LOGIN_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", res.data)
        self.assertIn("user", res.data)
        self.assertTrue(res.data["user"]["is_active"])
        self.assertTrue(res.data["user"]["is_staff"])

    def test_create_token_incorrect_password_error(self):
        """ユーザーtoken生成時間違ったパスワードエラー発生テスト"""
        db_user_data = {
            "name": "testuser",
            "email": "test@example.com",
            "password": "password123",
        }

        create_user(**db_user_data)

        payload = {"email": db_user_data["email"], "password": "incorrectpass"}

        res = self.client.post(LOGIN_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn("token", res.data)

    def test_create_token_blank_password_error(self):
        """ユーザーtoken生成時パスワード空欄エラー発生テスト"""
        db_user_data = {
            "name": "testuser",
            "email": "test@example.com",
            "password": "password123",
        }

        create_user(**db_user_data)

        payload = {"email": db_user_data["email"], "password": ""}

        res = self.client.post(LOGIN_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn("token", res.data)


class PrivateUserApiTests(TestCase):
    """Private user apiテスト"""

    def setUp(self):
        settings.ACCOUNT_EMAIL_VERIFICATION = None
        self.user = create_user(
            email="test@example.com",
            name="testuser",
            password="password123",
            is_active=True,
            is_staff=True,
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_user_profile_success(self):
        """自分のデータ-(メール、ネーム)の取得ができるかのテスト"""
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["email"], self.user.email)

    def test_me_not_allowed(self):
        """postでの通信に405エラーになるかのテスト"""
        res = self.client.post(ME_URL, {})
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_user_profile(self):
        """ユーザーデータのアップデートができるかのテスト"""
        payload = {"email": "updated@example.com"}
        res = self.client.patch(ME_URL, payload)
        self.user.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.email, payload["email"])
