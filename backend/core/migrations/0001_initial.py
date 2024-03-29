# Generated by Django 4.1.7 on 2023-02-20 07:00

import core.models
from django.db import migrations, models
import django.db.models.deletion
import imagekit.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
                ('name_kana', models.CharField(blank=True, max_length=40, null=True)),
                ('tel', models.CharField(max_length=40)),
                ('tel2', models.CharField(blank=True, max_length=40, null=True)),
                ('zipcode', models.CharField(blank=True, max_length=255, null=True)),
                ('address', models.CharField(max_length=255)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Pet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='名前', max_length=40)),
                ('sex', models.BooleanField(blank=True, help_text='オス=True、メス=False', null=True)),
                ('weight', models.IntegerField(blank=True, help_text='体重', null=True)),
                ('birth', models.DateField(help_text='誕生日', null=True)),
                ('death', models.DateField(blank=True, help_text='死亡日', null=True)),
                ('image', imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to=core.models.pet_image_file_path)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='PetDislike',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='PetLike',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='PetType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name='PetMemo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('memo', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('pet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='memos', to='core.pet')),
            ],
        ),
        migrations.CreateModel(
            name='PetBreed',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
                ('type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='pet_type', to='core.pettype')),
            ],
        ),
        migrations.AddField(
            model_name='pet',
            name='breed',
            field=models.ForeignKey(blank=True, help_text='柴犬･ネザーランドドワーフなど', null=True, on_delete=django.db.models.deletion.PROTECT, to='core.petbreed'),
        ),
        migrations.AddField(
            model_name='pet',
            name='customer',
            field=models.ForeignKey(help_text='顧客ナンバー', on_delete=django.db.models.deletion.CASCADE, related_name='pets', to='core.customer'),
        ),
        migrations.AddField(
            model_name='pet',
            name='dislikes',
            field=models.ManyToManyField(blank=True, help_text='苦手なこと', to='core.petdislike'),
        ),
        migrations.AddField(
            model_name='pet',
            name='likes',
            field=models.ManyToManyField(blank=True, help_text='好きなこと', to='core.petlike'),
        ),
        migrations.AddField(
            model_name='pet',
            name='type',
            field=models.ForeignKey(blank=True, help_text='犬･猫･うさぎなど', null=True, on_delete=django.db.models.deletion.PROTECT, to='core.pettype'),
        ),
        migrations.CreateModel(
            name='CustomerMemo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('memo', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='memos', to='core.customer')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('email', models.EmailField(max_length=50, unique=True)),
                ('name', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
