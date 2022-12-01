"""
Pet memo apiテスト
"""

from core.models import PetMemo
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.helper.create_dummy_pack import (
    create_user, create_staff, create_customer, create_pet
)

PET_MEMO_URL = reverse('pet:petmemo-list')


def detail_url(pet_breed_id):
    """memo detail URL生成 """
    return reverse('pet:petmemo-detail', args=[pet_breed_id])


class PublicPetMemoAPITests(TestCase):
    """認証なしユーザーのアクセス制限テスト"""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """認証が必要なことを確認するテスト"""
        res = self.client.get(PET_MEMO_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivatePetMemoApiTests(TestCase):
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
        res = self.client.get(PET_MEMO_URL)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivatePetMemoApiTestsForStaff(TestCase):
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
        self.pet = create_pet()

    def test_is_staff(self):
        """権限不足こと確認するテスト"""
        res = self.client.get(PET_MEMO_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_memo_list(self):
        """memoデータが正しく取得できるかの確認テスト"""
        memos = [
            {'memo': 'memo1', 'pet_id': self.pet.id},
            {'memo': 'memo2', 'pet_id': self.pet.id},
            {'memo': 'memo3', 'pet_id': self.pet.id},
            {'memo': 'memo4', 'pet_id': self.pet.id},
        ]

        for data in memos:
            PetMemo.objects.create(**data)

        res = self.client.get(PET_MEMO_URL)
        data = res.data['results']
        memos.reverse()

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), len(memos))
        self.assertEqual(data[0]['memo'], memos[0]['memo'])
        self.assertEqual(data[1]['memo'], memos[1]['memo'])
        self.assertEqual(data[2]['memo'], memos[2]['memo'])

    def test_create_memo(self):
        """pet memo生成テスト"""
        payload = {'memo': 'memo5', 'pet_id': self.pet.id}
        res = self.client.post(PET_MEMO_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['memo'], payload['memo'])

    def test_create_memo_without_pet_id(self):
        """pet idなしでのpet memo生成テスト"""
        payload = {'memo': 'memo5'}
        res = self.client.post(PET_MEMO_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_memo_nonexistent_pet_id(self):
        """存在しないpet idでのpet memo生成テスト"""
        payload = {'memo': 'memo5', 'pet_id': 888}
        res = self.client.post(PET_MEMO_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_pet_memo(self):
        """pet memo削除テスト"""
        memo = PetMemo.objects.create(memo="memo7", pet_id=self.pet.id)
        url = detail_url(memo.id)
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        memos = PetMemo.objects.all()
        self.assertFalse(memos.exists())

    def test_update_pet_memo(self):
        """"pet memo修正テスト"""
        memo = PetMemo.objects.create(memo="memo8", pet_id=self.pet.id)
        payload = {'memo': 'ホーランドロップ', 'pet_id': self.pet.id}
        url = detail_url(memo.id)
        res = self.client.patch(url, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        memo.refresh_from_db()
        self.assertEqual(memo.memo, payload['memo'])
