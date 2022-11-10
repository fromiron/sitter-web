"""
tests for models
"""

from django.contrib.auth import get_user_model
from django.test import TestCase


class ModelTests(TestCase):
    """Test Models"""

    def test_create_user_successful(self):
        """ユーザー生成テスト"""
        email = 'test@example.com'
        name = 'testuser'
        password = 'password123'
        user = get_user_model().objects.create_user(
            email=email,
            name=name,
            password=password
        )

        self.assertEqual(user.email, email)
        self.assertEqual(user.name, name)
        self.assertTrue(user.check_password(password))

    def test_create_user_email_normalized(self):
        """ユーザー生成テスト- email_normalized"""
        sample_emails = [
            ['test1@EXAMPLE.com', 'test1@example.com'],
            ['Test2@Example.com', 'Test2@example.com'],
            ['TEST3@EXAMPLE.com', 'TEST3@example.com'],
            ['test4@example.COM', 'test4@example.com'],
        ]

        for index, (email, expected) in enumerate(sample_emails):
            user = get_user_model().objects.create_user(
                email, index, 'sample123')
            self.assertEqual(user.email, expected)
