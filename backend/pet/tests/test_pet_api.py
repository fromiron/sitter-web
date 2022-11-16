"""
Pet apiテスト
"""

from core.models import Pet, Customer
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient


PET_URL = reverse('pet:pet-list')


def detail_url(pet_id):
    """顧客detail URL生成 """
    return reverse('pet:pet-detail', args=[pet_id])


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


class PublicPetAPITests(TestCase):
    """認証なしユーザーのアクセス制限テスト"""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """認証が必要なことを確認するテスト"""
        res = self.client.get(PET_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivatePetApiTests(TestCase):
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
        res = self.client.get(PET_URL)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivatePetApiTestsForStaff(TestCase):
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
        res = self.client.get(PET_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_pet_list(self):
        """petデータが正しく取得できるかの確認テスト"""
        pets = [
            {'name': 'testpet1', 'sex': True, 'birth': '2022-11-15',
                'customer': self.customer},
            {'name': 'testpet2', 'sex': False, 'birth': '2022-11-16',
                'customer': self.customer},
            {'name': 'testpet3', 'sex': True, 'birth': '2022-11-17',
                'customer': self.customer}
        ]

        for data in pets:
            Pet.objects.create(**data)

        res = self.client.get(PET_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), len(pets))
        self.assertEqual(res.data[0]['name'], pets[0]['name'])
        self.assertEqual(res.data[1]['name'], pets[1]['name'])
        self.assertEqual(res.data[2]['name'], pets[2]['name'])

    def test_create_pet(self):
        """pet生成テスト"""
        payload = {'name': 'testpet1', 'sex': True, 'birth': '2022-11-15',
                   'customer': self.customer.id}

        res = self.client.post(PET_URL, payload)
        data = res.data
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data['name'], payload['name'])
        self.assertEqual(data['sex'], payload['sex'])
        self.assertEqual(data['birth'], payload['birth'])
        self.assertEqual(data['customer'], payload['customer'])

    def test_delete_pet(self):
        """ペットデータ削除テスト"""
        customer = create_customer()
        pet = create_pet(customer=customer)
        url = detail_url(pet.id)
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Pet.objects.filter(id=pet.id).exists())

    # def test_create_pet_withe_new_type(self):
    #     """既存にないタイプを追加してペット情報を生成"""
    #     payload = {'name': 'testpet1', 'sex': True, 'birth': '2022-11-15',
    #                'customer': self.customer.id,
    #                'type': 'チンチラ'}

    #     res = self.client.post(PET_URL, payload)
    #     self.assertEqual(res.status_code, status.HTTP_201_CREATED)
