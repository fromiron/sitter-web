"""
    add seed data to database
"""

from django.core.management.base import BaseCommand
from django_seed import Seed
from core.models import Customer, Pet, PetBreed, PetType
from faker import Faker
import pykakasi
import random


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("--total", default=50, type=int, help="Test Customer data")

    def handle(self, *args, **options):
        total = options.get("total")
        seeder = Seed.seeder()
        kakasi = pykakasi.kakasi()
        customers = Customer.objects.all()

        types = ["うさぎ", "いぬ", "ねこ"]
        dogs = [
            "アイスランド・シープドッグ",
            "秋田犬",
            "アフガン・ハウンド",
            "ウトナーガン",
            "オーストラリアン・シェパード",
            "紀州",
            "北海道犬",
            "柴犬",
            "混血犬",
        ]
        cats = [
            "スコティッシュ・フォールド",
            "マンチカン",
            "混血猫",
            "アメリカン・ショートヘア",
            "ノルウェージャン・フォレスト・キャット",
            "ブリティッシュ・ショートヘア",
            "ラグドール",
        ]
        rabbits = [
            "混血兎",
            "ネザーランドドワーフ",
            "ホーランドロップ",
            "ミニうさぎ",
            "ロップイヤー",
            "ミニレッキス",
            "ライオンラビット",
        ]
        c = 0
        while c < total:
            c = c + 1
            faker = Faker(["ja_JP"])
            name = faker.name()
            kks = kakasi.convert(name)
            name = f"{kks[0]['hira']}"
            type, _ = PetType.objects.get_or_create(name=random.choice(types))
            breeds = []
            if type.name == "うさぎ":
                breeds = rabbits
            if type.name == "いぬ":
                breeds = dogs
            if type.name == "ねこ":
                breeds = cats
            breed, _ = PetBreed.objects.get_or_create(
                name=random.choice(breeds), type_id=type.id
            )
            seeder.add_entity(
                Pet,
                1,
                {
                    "name": name,
                    "sex": bool(random.getrandbits(1)),
                    "birth": faker.date(),
                    "death": faker.date() if random.randrange(1, 30) < 2 else None,
                    "type": type,
                    "breed": breed,
                    "customer": random.choice(customers),
                    "weight": random.uniform(400, 5000),
                    "image": None,
                },
            )
        seeder.execute()
        self.stdout.write(self.style.SUCCESS(f"{total}ペットデータ追加"))
