# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-07-10 05:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0022_auto_20170710_0556'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blueprint',
            name='name',
            field=models.CharField(max_length=255, verbose_name='Blueprint Name'),
        ),
    ]
