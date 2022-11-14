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

    def create_superuser(self, email, name, password):
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


class Memo(models.Model):
    """pet, customer memo model"""
    memo = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.memo


class Customer(models.Model):
    """Customer model"""

    name = models.CharField(max_length=40)
    name_kana = models.CharField(max_length=40, blank=True)
    tel = models.CharField(max_length=40)
    tel2 = models.CharField(max_length=40)
    address = models.CharField(max_length=255)
    memo = models.ForeignKey(
        Memo,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.name


class PetType(models.Model):
    """pet type model"""
    type = models.CharField(max_length=40, unique=True)

    def __str__(self):
        return self.type


class PetBreed(models.Model):
    """pet 品種 model"""
    name = models.CharField(max_length=40, unique=True)

    def __str__(self):
        return self.name


class Pet(models.Model):
    """Pet model"""
    name = models.CharField(max_length=40, help_text='名前')
    type = models.ForeignKey(
        PetType,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        help_text='犬･猫･うさぎなど',
    )
    breed = models.ForeignKey(
        PetBreed,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        help_text='柴犬･ネザーランドドワーフなど',
    )
    memo = models.ForeignKey(
        Memo,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    sex = models.BooleanField(help_text='オス=True、メス=False')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    birth = models.DateField(null=True, help_text='誕生日')
    death = models.DateField(null=True, help_text='死亡日')

    def __str__(self):
        return self.name
