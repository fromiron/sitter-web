"""
Models
"""
import os
import uuid
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone
from imagekit.models import ImageSpecField
from imagekit.processors import SmartResize, ResizeToFit
from imagekit.models import ProcessedImageField


def pet_image_file_path(instance, filename):
    """generate file path for new recipe image"""
    ext = os.path.splitext(filename)[1]
    filename = f"{uuid.uuid4()}{ext}"

    return os.path.join("uploads", "pet", filename)


class UserManager(BaseUserManager):
    """ユーザー管理"""

    def create_user(self, email, name, password=None, **extra_filed):
        """ユーザー登録"""
        now = timezone.now()
        if not email:
            raise ValueError("メールアドレスが必要です。")
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            **extra_filed,
            last_login=now,
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, name, password, **extra_filed):
        """スーパーユーザー登録"""
        user = self.create_user(email, name, password, **extra_filed)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user

    def create_staff(self, email, name, password, **extra_filed):
        """スーパーユーザー登録"""
        user = self.create_user(email, name, password, **extra_filed)
        user.is_staff = True
        user.is_superuser = False
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """ユーザーモデル"""

    email = models.EmailField(max_length=50, unique=True)
    name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.name


class Customer(models.Model):
    """Customer model"""

    name = models.CharField(max_length=40)
    name_kana = models.CharField(max_length=40, blank=True, null=True)
    tel = models.CharField(max_length=40)
    tel2 = models.CharField(max_length=40, blank=True, null=True)
    email = models.EmailField(max_length=40, blank=True, null=True)
    line = models.CharField(max_length=40, blank=True, null=True)
    zipcode = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class CustomerMemo(models.Model):
    """customer memo model"""

    memo = models.TextField()
    customer = models.ForeignKey(
        Customer, related_name="memos", on_delete=models.CASCADE
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.memo


class PetType(models.Model):
    """pet type model"""

    name = models.CharField(max_length=40)

    def __str__(self):
        return self.name


class PetBreed(models.Model):
    """pet 品種 model"""

    name = models.CharField(max_length=40)
    type = models.ForeignKey(
        PetType,
        related_name="pet_type",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.name


class PetLike(models.Model):
    """tag for filtering recipes"""

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class PetDislike(models.Model):
    """tag for filtering recipes"""

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Pet(models.Model):
    """Pet model"""

    name = models.CharField(max_length=40, help_text="名前")
    type = models.ForeignKey(
        PetType,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        help_text="犬･猫･うさぎなど",
    )
    breed = models.ForeignKey(
        PetBreed,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        help_text="柴犬･ネザーランドドワーフなど",
    )
    sex = models.BooleanField(help_text="オス=True、メス=False", blank=True, null=True)
    customer = models.ForeignKey(
        Customer, related_name="pets", on_delete=models.CASCADE, help_text="顧客ナンバー"
    )
    weight = models.IntegerField(blank=True, null=True, help_text="体重")
    likes = models.ManyToManyField(PetLike, blank=True, help_text="好きなこと")
    dislikes = models.ManyToManyField(PetDislike, blank=True, help_text="苦手なこと")
    birth = models.DateField(null=True, help_text="誕生日")
    death = models.DateField(blank=True, null=True, help_text="死亡日")
    image = ProcessedImageField(
        blank=True,
        null=True,
        upload_to=pet_image_file_path,
        processors=[ResizeToFit(500, 500)],
        format="PNG",
        options={"quality": 80},
    )
    thumbnail = ImageSpecField(
        source="image",
        processors=[SmartResize(100, 100)],
        format="PNG",
        options={"quality": 60},
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class PetMemo(models.Model):
    """pet  memo model"""

    memo = models.TextField()
    pet = models.ForeignKey(Pet, related_name="memos", on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.memo


# TODO karteモデル作成
# class Karte(models.Model):
#     """Sitting karte"""
#     feed_place = models.CharField(help_text='食事する場所')
#     feed_dishe = models.CharField(help_text='食器の場所')
#     food_place = models.CharField(help_text='フードの場所')
#     food_amount = models.CharField(help_text='フードの量')
#     water_type = models.CharField(help_text='水のタイプ')
