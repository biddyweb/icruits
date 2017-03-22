from django.contrib import admin
from seo.models import MetaTags


# Register your models here.
class MetaTagsAdmin(admin.ModelAdmin):
    pass


admin.site.register(MetaTags, MetaTagsAdmin)
