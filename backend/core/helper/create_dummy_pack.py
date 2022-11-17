"""test case用のデータ生成"""
from core.models import Pet, Customer, PetBreed, PetType
from django.contrib.auth import get_user_model


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


def create_pet(**params):
    """pet生成"""
    customer = create_customer()
    defaults = {'name': 'testpet1', 'sex': True,
                'birth': '2022-11-15', 'customer': customer}
    defaults.update(params)
    return Pet.objects.create(**defaults)


def create_pet_type(**params):
    """petタイプ生成"""
    defaults = {'name': 'うさぎ'}
    defaults.update(params)
    return PetType.objects.create(**defaults)


def create_pet_breed(**params):
    """petタイプ生成"""
    defaults = {'name': 'うさぎ'}
    defaults.update(params)
    return PetBreed.objects.create(**defaults)
