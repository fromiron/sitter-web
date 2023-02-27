"""
    add seed data to database
"""

import random
import string

import pykakasi
from django.core.management.base import BaseCommand
from django_seed import Seed
from faker import Faker

from core.models import Customer


def generate_tel_number():
    a = str(random.randint(0, 999)).zfill(3)
    b = str(random.randint(0, 9999)).zfill(4)
    c = str(random.randint(0, 9999)).zfill(4)
    return f"{a}-{b}-{c}"


def generate_zipcode():
    a = str(random.randint(0, 999)).zfill(3)
    b = str(random.randint(0, 9999)).zfill(4)
    return f"{a}-{b}"


def generate_email():
    id_length = random.randint(5, 10)
    letters = string.ascii_lowercase
    email_id = "".join(random.choice(letters) for i in range(id_length))
    domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
    domain = random.choice(domains)
    email = email_id + "@" + domain
    return email


def generate_line():
    id_length = random.randint(5, 10)
    letters = string.ascii_lowercase
    return "".join(random.choice(letters) for i in range(id_length))


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("--total", default=50, type=int, help="Test Customer data")

    def handle(self, *args, **options):
        total = options.get("total")
        seeder = Seed.seeder()
        kakasi = pykakasi.kakasi()
        c = 0
        while c < total:
            c = c + 1
            faker = Faker(["ja_JP"])
            name = faker.name()
            kks = kakasi.convert(name)
            name_kana = f"{kks[0]['hira']} {kks[2]['hira']}"
            seeder.add_entity(
                Customer,
                1,
                {
                    "name": name,
                    "name_kana": name_kana,
                    "tel": generate_tel_number(),
                    "tel2": generate_tel_number(),
                    "email": generate_email(),
                    "line": generate_line(),
                    "zipcode": generate_zipcode(),
                    "address": faker.address(),
                },
            )
            seeder.execute()
        self.stdout.write(self.style.SUCCESS(f"{total}顧客データ追加"))
