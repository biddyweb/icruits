from __future__ import unicode_literals
from django.utils.translation import ugettext_lazy as _
from django.db import models


# Create your models here.
class MetaTags(models.Model):
    title = models.CharField(_('Page Title'), max_length=255)
    page_name = models.CharField(_('Page Name'), max_length=255)
    description = models.CharField(_('Page Description'), max_length=255)

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = 'Meta Tag'
        verbose_name_plural = 'Meta Tags'
