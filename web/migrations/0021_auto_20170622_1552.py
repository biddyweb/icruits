# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-06-22 15:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0020_auto_20170622_1550'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='preference_filter',
            field=models.CharField(blank=True, default='', max_length=255, verbose_name='Preference Filter Search'),
            preserve_default=False,
        ),
    ]
