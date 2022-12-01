"""
Pet type apiテスト
"""

from core.models import PetType
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.helper.create_dummy_pack import (
    create_user, create_staff, create_customer
)


PET_TYPE_URL = reverse('pet:pettype-list')


def detail_url(pet_type_id):
    """顧客detail URL生成 """
    return reverse('pet:pettype-detail', args=[pet_type_id])


class PublicPetTypeAPITests(TestCase):
    """認証なしユーザーのアクセス制限テスト"""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """認証が必要なことを確認するテスト"""
        res = self.client.get(PET_TYPE_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivatePetTypeApiTests(TestCase):
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
        res = self.client.get(PET_TYPE_URL)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivatePetTypeApiTestsForStaff(TestCase):
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
        res = self.client.get(PET_TYPE_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_pet_type_list(self):
        """petデータが正しく取得できるかの確認テスト"""
        pets = [
            {'name': 'いぬ'},
            {'name': 'ねこ'},
            {'name': 'うさぎ'},
            {'name': 'とり'},
        ]

        for data in pets:
            PetType.objects.create(**data)

        res = self.client.get(PET_TYPE_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), len(pets))
        self.assertEqual(res.data[0]['name'], pets[0]['name'])
        self.assertEqual(res.data[1]['name'], pets[1]['name'])
        self.assertEqual(res.data[2]['name'], pets[2]['name'])

    def test_create_pet_type(self):
        """pet type生成テスト"""
        payload = {'name': 'いぬ'}
        res = self.client.post(PET_TYPE_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['name'], payload['name'])

    def test_delete_pet_type(self):
        """pet type削除テスト"""
        type = PetType.objects.create(name="いぬ")
        url = detail_url(type.id)
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        types = PetType.objects.all()
        self.assertFalse(types.exists())

    def test_update_type(self):
        """"pet type修正テスト"""
        type = PetType.objects.create(name="いぬ")
        payload = {'name': 'ねこ'}
        url = detail_url(type.id)
        res = self.client.patch(url, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        type.refresh_from_db()
        self.assertEqual(type.name, payload['name'])

    def test_pet_type_filter(self):
        """pet typeの検索結果が正しく取得できるかの確認テスト"""
        pets = [
            {'name': 'いぬ'},
            {'name': 'ねこ'},
            {'name': 'うさぎ'},
            {'name': 'とり'},
        ]

        for data in pets:
            PetType.objects.create(**data)

        search_url = PET_TYPE_URL + '?name=うさぎ'
        res = self.client.get(search_url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['name'], 'うさぎ')
