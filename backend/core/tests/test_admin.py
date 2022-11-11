"""
admin panel action test
"""

from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse
from rest_framework import status


class AdminPanelTests(TestCase):
    """
    アドミンパネル機能テスト

    REVERSE URL DOC
    https://docs.djangoproject.com/en/dev/ref/contrib/admin/#reversing-admin-urls
    """

    def setUp(self) -> None:

        self.client = Client()
        self.admin_user = get_user_model().objects.create_superuser(
            email='admin@example.com',
            name='testadmin',
            password='password123'
        )
        self.client.force_login(self.admin_user)
        self.user = get_user_model().objects.create_user(
            email='user@example.com',
            name='testuser',
            password='password123'
        )

    def test_users_list(self):
        """
        ユーザーリストがaあるか確認するテストケース
        """
        url = reverse('admin:core_user_changelist')
        res = self.client.get(url)

        self.assertContains(res, self.user.name)
        self.assertContains(res, self.user.email)

    def test_user_edit_page(self):
        """
        ユーザー修正ページアクセステストケース
        """
        url = reverse('admin:core_user_change', args=[self.user.id])
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_create_user_page(self):
        """
        ユーザー登録ページアクセステストケース
        """
        url = reverse('admin:core_user_add')
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
