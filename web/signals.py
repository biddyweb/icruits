# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.dispatch.dispatcher import receiver
from django.db.models.signals import (
    post_delete,
    post_save
)
from web.models import (
    WorkEnviorment,
    WorkEnviorment2,
    Blueprint
)


@receiver(post_save, sender=WorkEnviorment)
def delete_workenvironment_temp(sender, instance, **kwargs):
    if Blueprint.objects.filter(work_enviorment=instance.image).first():
        return
    storage, path = instance.image.storage, instance.image.path
    storage.delete(path)


@receiver(post_save, sender=WorkEnviorment2)
def delete_workenvironment2_temp(sender, instance, **kwargs):
    if Blueprint.objects.filter(work_enviorment_2=instance.image).first():
        return
    storage, path = instance.image.storage, instance.image.path
    storage.delete(path)
