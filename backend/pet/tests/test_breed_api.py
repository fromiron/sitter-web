"""
Pet Breed apiテスト
"""

from core.models import PetBreed
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.helper.create_dummy_pack import (
    create_user, create_staff, create_customer
)

PET_BREED_URL = reverse('pet:petbreed-list')


def detail_url(pet_breed_id):
    """顧客detail URL生成 """
    return reverse('pet:petbreed-detail', args=[pet_breed_id])


class PublicPetBreedAPITests(TestCase):
    """認証なしユーザーのアクセス制限テスト"""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """認証が必要なことを確認するテスト"""
        res = self.client.get(PET_BREED_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivatePetBreedApiTests(TestCase):
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
        res = self.client.get(PET_BREED_URL)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivatePetBreedApiTestsForStaff(TestCase):
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
        res = self.client.get(PET_BREED_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_pet_breed_list(self):
        """pet breedデータが正しく取得できるかの確認テスト"""
        pets = [
            {'name': '柴犬'},
            {'name': 'ネザーランドドワーフ'},
            {'name': 'シベリアンハスキー'},
            {'name': 'ブリティッシュショートヘア'},
        ]

        for data in pets:
            PetBreed.objects.create(**data)

        res = self.client.get(PET_BREED_URL)
        data = res.data['results']
        pets.reverse()

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), len(pets))
        self.assertEqual(data[0]['name'], pets[0]['name'])
        self.assertEqual(data[1]['name'], pets[1]['name'])
        self.assertEqual(data[2]['name'], pets[2]['name'])

    def test_create_pet_breed(self):
        """pet breed生成テスト"""
        payload = {'name': 'ネザーランドドワーフ'}
        res = self.client.post(PET_BREED_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['name'], payload['name'])

    def test_delete_pet_breed(self):
        """pet breed削除テスト"""
        breed = PetBreed.objects.create(name="ネザーランドドワーフ")
        url = detail_url(breed.id)
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        breeds = PetBreed.objects.all()
        self.assertFalse(breeds.exists())

    def test_update_breed(self):
        """"pet breed修正テスト"""
        breed = PetBreed.objects.create(name="ネザーランドドワーフ")
        payload = {'name': 'ホーランドロップ'}
        url = detail_url(breed.id)
        res = self.client.patch(url, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        breed.refresh_from_db()
        self.assertEqual(breed.name, payload['name'])

    def test_pet_breed_filter(self):
        """pet breedの検索結果が正しく取得できるかの確認テスト"""
        pets = [
            {'name': '柴犬'},
            {'name': 'ネザーランドドワーフ'},
            {'name': 'シベリアンハスキー'},
            {'name': 'ブリティッシュショートヘア'},
        ]

        for data in pets:
            PetBreed.objects.create(**data)

        search_url = PET_BREED_URL + '?name=ネザーランドドワーフ'
        res = self.client.get(search_url)
        data = res.data['results']
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], 'ネザーランドドワーフ')
