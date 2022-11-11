"""
Models
"""

from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)


class UserManager(BaseUserManager):
    """ユーザー管理"""

    def create_user(self, email, name, password=None, **extra_filed):
        """ユーザー登録"""
        if not email:
            raise ValueError('メールアドレスが必要です。')
        if not name:
            raise ValueError('ネーム指定が必要です。')
        user = self.model(email=self.normalize_email(
            email), name=name, **extra_filed)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, name,  password):
        """スーパーユーザー登録"""
        user = self.create_user(email, name, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """ユーザーモデル"""
    email = models.EmailField(max_length=50, unique=True)
    name = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
