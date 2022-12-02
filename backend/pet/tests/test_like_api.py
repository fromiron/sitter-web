"""
Pet Like apiテスト
"""

from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.helper.create_dummy_pack import (
    create_pet_like, create_user, create_staff, create_customer
)

PET_LIKE_URL = reverse('pet:petlike-list')


def detail_url(pet_like_id):
    """顧客detail URL生成 """
    return reverse('pet:petlike-detail', args=[pet_like_id])


class PublicPetLikeAPITests(TestCase):
    """認証なしユーザーのアクセス制限テスト"""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """認証が必要なことを確認するテスト"""
        res = self.client.get(PET_LIKE_URL)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivatePetLikeApiTests(TestCase):
    """認証済ユーザーテスト"""

    def setUp(self):
        self.user = create_user(
            email='test@example.com',
            name='testuser',
            password='password123',
            is_staff=False
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_is_not_staff(self):
        """権限不足こと確認するテスト"""
        res = self.client.get(PET_LIKE_URL)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivatePetLikeApiTestsForStaff(TestCase):
    """スタッフユーザーテスト"""

    def setUp(self):
        self.user = create_staff(
            email='staff@example.com',
            name='staff',
            password='password123',
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.customer = create_customer()

    def test_is_staff(self):
        """権限不足こと確認するテスト"""
        res = self.client.get(PET_LIKE_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_pet_like_list(self):
        """petデータが正しく取得できるかの確認テスト"""
        likes = [
            {'name': 'りんご'},
            {'name': 'バナナ'},
            {'name': 'パパイヤ'},
            {'name': '生米'},
        ]

        for data in likes:
            create_pet_like(**data)

        res = self.client.get(PET_LIKE_URL)
        data = res.data['results']
        likes.reverse()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), len(likes))
        self.assertEqual(data[0]['name'], likes[0]['name'])
        self.assertEqual(data[1]['name'], likes[1]['name'])
        self.assertEqual(data[2]['name'], likes[2]['name'])
        self.assertEqual(data[3]['name'], likes[3]['name'])

    def test_create_pet_like(self):
        """pet like生成テスト"""
        payload = {'name': '乾燥いちご'}
        res = self.client.post(PET_LIKE_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['name'], payload['name'])


# TODO create test cake (delete, update, search)
