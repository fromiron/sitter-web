# Generated by Django 4.1.6 on 2023-02-03 02:17

import core.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pet',
            name='image',
            field=models.ImageField(null=True, upload_to=core.models.pet_image_file_path),
        ),
    ]