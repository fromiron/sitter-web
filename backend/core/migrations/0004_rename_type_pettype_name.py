# Generated by Django 4.1.3 on 2022-11-16 06:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_pet_death'),
    ]

    operations = [
        migrations.RenameField(
            model_name='pettype',
            old_name='type',
            new_name='name',
        ),
    ]