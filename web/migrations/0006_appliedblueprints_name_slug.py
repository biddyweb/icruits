# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-12 07:41
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0005_appliedblueprints'),
    ]

    operations = [
        migrations.AddField(
            model_name='appliedblueprints',
            name='name_slug',
            field=models.SlugField(blank=True, max_length=255, unique=True, verbose_name='Blueprint Name Slug'),
        ),
    ]
