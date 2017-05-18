# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-18 12:59
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0017_auto_20170512_1719'),
    ]

    operations = [
        migrations.CreateModel(
            name='WaitingListToEnterStack',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Waiting List',
            },
        ),
        migrations.AlterField(
            model_name='blueprint',
            name='url',
            field=models.CharField(blank=True, max_length=255, verbose_name='Company Url'),
        ),
        migrations.AddField(
            model_name='waitinglisttoenterstack',
            name='blueprint',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='related_blueprint_model', to='web.Blueprint'),
        ),
        migrations.AddField(
            model_name='waitinglisttoenterstack',
            name='employee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='related_user_model', to=settings.AUTH_USER_MODEL),
        ),
    ]
