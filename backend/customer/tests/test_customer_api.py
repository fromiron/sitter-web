"""
顧客apiテスト
"""


from core.models import Customer
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

CUSTOMER_URL = reverse('customer:customer-list')


def detail_url(customer_id):
    """顧客detail URL生成 """
    return reverse('customer:customer-detail', args=[customer_id])


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


class PublicCustomerAPITests(TestCase):
    """認証なしユーザーのアクセス制限テスト"""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """認証が必要なことを確認するテスト"""
        res = self.client.get(CUSTOMER_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateCustomerApiTests(TestCase):
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
        res = self.client.get(CUSTOMER_URL)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivateCustomerApiTestsForStaff(TestCase):
    """スタッフユーザーテスト"""

    def setUp(self):
        self.user = create_staff(
            email='staff@example.com',
            name='staff',
            password='password123',
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_is_staff(self):
        """権限不足こと確認するテスト"""
        res = self.client.get(CUSTOMER_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_customer_list(self):
        """顧客データが正しく取得できるかの確認テスト"""
        customers = [
            {'name': 'testuser1', 'name_kana': 'testuser1_kana',
                'tel': '001-012-1111', 'address': 'address1111'},
            {'name': 'testuser2', 'name_kana': 'testuser2_kana',
                'tel': '001-012-2222', 'address': 'address2222'},
            {'name': 'testuser1', 'name_kana': 'testuser3_kana',
                'tel': '001-012-3333', 'address': 'address3333'},
        ]

        for data in customers:
            Customer.objects.create(**data)

        res = self.client.get(CUSTOMER_URL)
        data = res.data['results']
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), len(customers))
        self.assertEqual(data[0]['name'], customers[0]['name'])
        self.assertEqual(data[1]['name_kana'], customers[1]['name_kana'])
        self.assertEqual(data[2]['tel'], customers[2]['tel'])

    def test_create_customer(self):
        """顧客生成テスト"""
        payload = {'name': 'testuser1', 'name_kana': 'testuser1_kana',
                   'tel': '001-012-1111', 'address': 'address1111'}

        res = self.client.post(CUSTOMER_URL, payload)
        data = res.data
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data['name'], payload['name'])
        self.assertEqual(data['name_kana'], payload['name_kana'])
        self.assertEqual(data['tel'], payload['tel'])
        self.assertEqual(data['address'], payload['address'])

    def test_patch_customer(self):
        """顧客部分修正テスト"""
        customer = create_customer()
        payload = {'name': 'patched name'}
        url = detail_url(customer.id)

        res = self.client.patch(url, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        customer.refresh_from_db()
        self.assertEqual(customer.name, payload['name'])

    def test_put_customer(self):
        """"顧客完全修正テスト"""
        customer = create_customer()
        payload = {
            'name': 'testuser1', 'name_kana': 'testuser3_kana',
            'tel': '001-012-3333', 'tel2': '002-012-3333',
            'address': 'address3333'
        }
        url = detail_url(customer.id)

        res = self.client.put(url, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        customer.refresh_from_db()
        self.assertEqual(customer.name, payload['name'])
        self.assertEqual(customer.name_kana, payload['name_kana'])
        self.assertEqual(customer.tel, payload['tel'])
        self.assertEqual(customer.tel2, payload['tel2'])
        self.assertEqual(customer.address, payload['address'])

    def test_delete_customer(self):
        """顧客削除テスト"""
        customer = create_customer()
        url = detail_url(customer.id)
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Customer.objects.filter(id=customer.id).exists())
