# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-13 21:54
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0009_appliedblueprints_has_failed'),
    ]

    operations = [
        migrations.CreateModel(
            name='PrehiredEmployee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('blueprint', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='related_blueprint_id', to='web.Blueprint')),
                ('employee', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='related_user_id', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Pre-hired Employee',
            },
        ),
    ]