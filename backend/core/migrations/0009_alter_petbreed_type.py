# Generated by Django 4.1.6 on 2023-02-10 03:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_alter_petbreed_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='petbreed',
            name='type',
            field=models.ForeignKey(blank=True, default=9999, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='pet_type', to='core.pettype'),
        ),
    ]
