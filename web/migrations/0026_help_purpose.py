# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-07-27 08:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0025_auto_20170727_0554'),
    ]

    operations = [
        migrations.AddField(
            model_name='help',
            name='purpose',
            field=models.SlugField(default='general', help_text='Describe what this help page is going to contain as help material', max_length=255, verbose_name='Purpose of this Help page'),
            preserve_default=False,
        ),
    ]
