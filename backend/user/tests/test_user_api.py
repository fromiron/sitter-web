"""
ユーザーapiテスト
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status


CREATE_USER_URL = reverse('user:create')
# https://github.com/iMerica/dj-rest-auth/blob/master/dj_rest_auth/urls.py
# url reverse name参照
TOKEN_USER_URL = reverse('rest_login')
ME_URL = reverse('rest_user_details')


def create_user(**params):
    """ユーザー生成、リターン"""
    return get_user_model().objects.create_user(**params)


class PublicUserApiTests(TestCase):
    """Public user apiテスト"""

    def setUp(self):
        self.client = APIClient()

    def test_create_user_success(self):
        """ユーザー生成成功テスト"""
        payload = {
            'email': 'test@example.com',
            'name': 'testuser',
            'password': 'passsword123'
        }
        res = self.client.post(CREATE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(email=payload['email'])
        self.assertTrue(user.check_password(payload['password']))
        self.assertNotIn('password', res.data)

    def test_create_user_email_exists_error(self):
        """ユーザー生成中、メール中腹エラーテスト"""
        payload = {
            'email': 'test@example.com',
            'name': 'testuser',
            'password': 'passsword123'
        }
        create_user(**payload)
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_mail_is_null_error(self):
        """ユーザー生成中、メール未入力エラーテスト"""
        payload = {
            'email': '',
            'name': 'testuser',
            'password': 'passsword123'
        }
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(
            email=payload['email']
        ).exists()
        self.assertFalse(user_exists)

    def test_create_user_name_is_null_error(self):
        """ユーザー生成中、名前未入力エラーテスト"""
        payload = {
            'email': 'test@example.com',
            'name': '',
            'password': 'passsword123'
        }
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(
            email=payload['email']
        ).exists()
        self.assertFalse(user_exists)

    def test_create_user_password_too_short_error(self):
        """ユーザー生成中、passwordが短いとき(8文字未満)エラーテスト"""
        payload = {
            'email': 'test@example.com',
            'name': 'testuser',
            'password': 'passs'
        }
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(
            email=payload['email']
        ).exists()
        self.assertFalse(user_exists)

    def test_create_token_success(self):
        """ユーザーtoken生成テスト"""
        db_user_data = {
            'name': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
        }

        create_user(**db_user_data)

        payload = {
            'email': db_user_data['email'],
            'password': db_user_data['password']
        }

        res = self.client.post(TOKEN_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', res.data)

    def test_create_token_incorrect_password_error(self):
        """ユーザーtoken生成時間違ったパスワードエラー発生テスト"""
        db_user_data = {
            'name': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
        }

        create_user(**db_user_data)

        payload = {
            'email': db_user_data['email'],
            'password': 'incorrectpass'
        }

        res = self.client.post(TOKEN_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('token', res.data)

    def test_create_token_blank_password_error(self):
        """ユーザーtoken生成時パスワード空欄エラー発生テスト"""
        db_user_data = {
            'name': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
        }

        create_user(**db_user_data)

        payload = {
            'email': db_user_data['email'],
            'password': ''
        }

        res = self.client.post(TOKEN_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('token', res.data)


class PrivateUserApiTests(TestCase):
    """Private user apiテスト"""

    def setUp(self):
        self.user = create_user(
            email='test@example.com',
            name='testuser',
            password='password123',
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_user_profile_success(self):
        """自分のデータ-(メール、ネーム)の取得ができるかのテスト"""
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            'name': self.user.name,
            'email': self.user.email
        })

    def test_me_not_allowed(self):
        """postでの通信に405エラーになるかのテスト"""
        res = self.client.post(ME_URL, {})
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_user_profile(self):
        """ユーザーデータのアップデートができるかのテスト"""
        payload = {'name': 'testname - updated', 'password': 'newpasswrod123'}

        res = self.client.patch(ME_URL, payload)

        self.user.refresh_from_db()
        self.assertEqual(self.user.name, payload['name'])
        self.assertEqual(res.status_code, status.HTTP_200_OK)
