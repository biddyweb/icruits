# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-19 06:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0012_auto_20170415_1306'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='appliedblueprints',
            options={'verbose_name': 'Applied Blueprint'},
        ),
        migrations.AlterModelOptions(
            name='queuestack',
            options={'verbose_name': 'Queue Stack'},
        ),
        migrations.AddField(
            model_name='user',
            name='preference_filter',
            field=models.TextField(blank=True, verbose_name='Preference Filter Search'),
        ),
    ]
