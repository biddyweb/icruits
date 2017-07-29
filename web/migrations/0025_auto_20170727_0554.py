# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-07-27 05:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0024_auto_20170723_0637'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_subscribed',
            field=models.BooleanField(default=False, help_text='Designates whether this user should recieve email about new jobs posted on iCruits.', verbose_name='Subscribed to New Job Feed'),
        ),
        migrations.AddField(
            model_name='user',
            name='wants_explanation',
            field=models.BooleanField(default=True, help_text='Designates whether tis user should be displayed with explanation popup.', verbose_name='Want to see explanation window'),
        ),
    ]