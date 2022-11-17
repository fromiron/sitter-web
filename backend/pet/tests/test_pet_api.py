"""
Pet apiテスト
"""

from core.models import Pet
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.helper.create_dummy_pack import (
    create_user, create_staff, create_customer, create_pet
)

PET_URL = reverse('pet:pet-list')


def detail_url(pet_id):
    """顧客detail URL生成 """
    return reverse('pet:pet-detail', args=[pet_id])


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

    def test_create_pet_withe_new_type(self):
        """既存にないタイプを追加してペット情報を生成"""
        payload = {'name': 'testpet122', 'sex': True, 'birth': '2022-11-12',
                   'type': {"name": "ネザーランドドワーフ"},
                   'customer': self.customer.id}

        res = self.client.post(PET_URL, payload, format='json')
        data = res.data
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data['name'], payload['name'])
        self.assertEqual(data['type']['name'], payload['type']['name'])

    def test_create_pet_withe_same_type(self):
        """既存にあるタイプを追加してペット情報を生成"""
        payload1 = {'name': 'testpet1', 'sex': True, 'birth': '2022-11-12',
                    'type': {"name": "ネザーランドドワーフ"},
                    'customer': self.customer.id}

        payload2 = {'name': 'testpet2', 'sex': True, 'birth': '2022-11-13',
                    'type': {"name": "ネザーランドドワーフ"},
                    'customer': self.customer.id}

        res1 = self.client.post(PET_URL, payload1, format='json')
        data1 = res1.data
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        res2 = self.client.post(PET_URL, payload2, format='json')
        data2 = res2.data
        self.assertEqual(res2.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data1['type']['id'], data2['type']['id'])

    # def test_update_pet_data_with_type(self):
    #     """タイプと当時にpetデータをアップデートするテスト"""

    #     defaults = {'name': 'testpet1', 'sex': True, 'birth': '2022-11-12',
    #                 'type': {"name": "ネザーランドドワーフ"},
    #                 'customer': self.customer.id}
    #     petType = create_pettype('ネザーランドドワーフ')

    #     pet = create_pet(**defaults)

    #     payload = {'name': 'testpet2', 'sex': True, 'birth': '2022-11-12',
    #                'type': {"name": "ホーランドロップ"},
    #                'customer': self.customer.id}

    #     res = self.client.post(PET_URL, payload, format='json')
    #     self.assertEqual(res.status_code, status.HTTP_200_OK)
