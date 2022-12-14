"""
    add seed data to database
"""

from django.core.management.base import BaseCommand
from django_seed import Seed
from core.models import Customer
from faker import Faker
import pykakasi
import random


def generate_tel_number():
    a = str(random.randint(0, 999)).zfill(3)
    b = str(random.randint(0, 999)).zfill(4)
    c = str(random.randint(0, 999)).zfill(4)
    return f"{a}-{b}-{c}"


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
        c = 0
        while c < total:
            c = c + 1
            faker = Faker(['ja_JP'])
            name = faker.name()
            kks = kakasi.convert(name)
            name_kana = f"{kks[0]['hira']} {kks[2]['hira']}"
            seeder.add_entity(Customer,
                              1,
                              {
                                  "name": name,
                                  "name_kana": name_kana,
                                  "tel": generate_tel_number(),
                                  "tel2": generate_tel_number(),
                                  "address": faker.address(),
                              }
                              )
        seeder.execute()
        self.stdout.write(self.style.SUCCESS(f"{total}顧客データ追加"))

    # name = models.CharField(max_length=40)
    # name_kana = models.CharField(max_length=40, blank=True, null=True)
    # tel = models.CharField(max_length=40)
    # tel2 = models.CharField(max_length=40, blank=True, null=True)
    # address = models.CharField(max_length=255)
