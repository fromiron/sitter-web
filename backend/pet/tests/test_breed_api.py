"""
Pet Breed apiテスト
"""

from core.models import Pet, Customer, PetBreed
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient


PET_BREED_URL = reverse('pet:petbreed-list')


def detail_url(pet_breed_id):
    """顧客detail URL生成 """
    return reverse('pet:petbreed-detail', args=[pet_breed_id])


def create_user(**params):
    """ユーザー生成"""
    return get_user_model().objects.create_user(**params)


def create_staff(**params):
    """staff生成"""
    return get_user_model().objects.create_staff(**params)


def create_customer(**params):
    """顧客生成"""
    defaults = {
        'name': 'testuser1', 'name_kana': 'testuser1_kana',
        'tel': '001-012-1111', 'tel2': '002-012-1111', 'address': 'address1111'
    }
    defaults.update(params)
    return Customer.objects.create(**defaults)


def create_pet(customer, **params):
    """pet生成"""
    defaults = {'name': 'testpet1', 'sex': True, 'birth': '2022-11-15'}
    defaults.update(params)

    return Pet.objects.create(customer=customer, **defaults)


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

    def test_get_pet_type_list(self):
        """petデータが正しく取得できるかの確認テスト"""
        pets = [
            {'name': '柴犬'},
            {'name': 'ネザーランドドワーフ'},
            {'name': 'シベリアンハスキー'},
            {'name': 'ブリティッシュショートヘア'},
        ]

        for data in pets:
            PetBreed.objects.create(**data)

        res = self.client.get(PET_BREED_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), len(pets))
        self.assertEqual(res.data[0]['name'], pets[0]['name'])
        self.assertEqual(res.data[1]['name'], pets[1]['name'])
        self.assertEqual(res.data[2]['name'], pets[2]['name'])

    def test_create_pet_type(self):
        """pet breed生成テスト"""
        payload = {'name': 'ネザーランドドワーフ'}
        res = self.client.post(PET_BREED_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['name'], payload['name'])

    def test_delete_pet_type(self):
        """pet breed削除テスト"""
        type = PetBreed.objects.create(name="ネザーランドドワーフ")
        url = detail_url(type.id)
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        types = PetBreed.objects.all()
        self.assertFalse(types.exists())

    def test_update_type(self):
        """"pet breed修正テスト"""
        type = PetBreed.objects.create(name="ネザーランドドワーフ")
        payload = {'name': 'ホーランドロップ'}
        url = detail_url(type.id)
        res = self.client.patch(url, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        type.refresh_from_db()
        self.assertEqual(type.name, payload['name'])
