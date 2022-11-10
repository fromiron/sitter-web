"""
tests for models
"""
import random
import string

from django.contrib.auth import get_user_model
from django.test import TestCase


def get_random_string(length: int) -> str:
    """return random string"""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


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

        for email, expected in sample_emails:
            user = get_user_model().objects.create_user(
                email, get_random_string(5), 'password123')
            self.assertEqual(user.email, expected)

    def test_create_user_without_email(self):
        """Eメールなしでのユーザー生成テスト"""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user('', 'testuser', 'password123')

    def test_create_user_without_name(self):
        """ネームなしでのユーザー生成テスト"""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(
                'test@example.com', '', 'password123'
            )
