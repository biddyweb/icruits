# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-15 13:06
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0011_auto_20170415_0522'),
    ]

    operations = [
        migrations.CreateModel(
            name='HiredEmployee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Hired History',
            },
        ),
        migrations.AlterModelOptions(
            name='prehiredemployee',
            options={'verbose_name': 'Interview History'},
        ),
        migrations.AddField(
            model_name='blueprint',
            name='url',
            field=models.CharField(blank=True, max_length=255, verbose_name='Interview Url'),
        ),
        migrations.AddField(
            model_name='hiredemployee',
            name='blueprint',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='related_hired_blueprint', to='web.Blueprint'),
        ),
        migrations.AddField(
            model_name='hiredemployee',
            name='employee',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='related_hired_user', to=settings.AUTH_USER_MODEL),
        ),
    ]