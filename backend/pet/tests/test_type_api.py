"""
Pet type apiテスト
"""

from core.models import Pet, Customer, PetType
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient


PET_TYPE_URL = reverse('pet:pettype-list')


def detail_url(pet_type_id):
    """顧客detail URL生成 """
    return reverse('pet:pettype-detail', args=[pet_type_id])


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