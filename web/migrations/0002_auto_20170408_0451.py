# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-08 04:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='testpilots',
            name='email',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='testpilots',
            name='name',
            field=models.CharField(blank=True, max_length=64),
        ),
    ]
