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
        parser.add_argument(
            "--total",
            default=50,
            type=int,
            help="Test Customer data"
        )

    def handle(self, *args, **options):
        total = options.get("total")
        seeder = Seed.seeder()
        kakasi = pykakasi.kakasi()
        customers = Customer.objects.all()

        types = ["うさぎ", "いぬ", "ねこ"]
        breeds = ["ネザーランドドワーフ", "ホーランドロップ", "しば", "あきた", "マンチカン", "スピンクス"]
        c = 0
        while c < total:
            c = c + 1
            faker = Faker(['ja_JP'])
            name = faker.name()
            kks = kakasi.convert(name)
            name = f"{kks[0]['hira']}"
            type, _ = PetType.objects.get_or_create(name=random.choice(types))
            breed, _ = PetBreed.objects.get_or_create(
                name=random.choice(breeds))
            seeder.add_entity(Pet,
                              1,
                              {
                                  "name": name,
                                  "sex": bool(random.getrandbits(1)),
                                  "birth": faker.date(),
                                  "death": faker.date() if random.randrange(1, 30) < 2 else None,
                                  "type": type,
                                  "breed": breed,
                                  "customer": random.choice(customers),
                                  "weight": random.uniform(1, 20)
                              }
                              )
        seeder.execute()
        self.stdout.write(self.style.SUCCESS(f"{total}ペットデータ追加"))
