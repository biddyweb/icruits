from django.contrib import admin
from web.models import (
    JobFeed,
    QuestionAnswer,
    Help,
    user,
)


# Register your models here.
class JobFeedAdmin(admin.ModelAdmin):
    pass


class QuestionAnswerInline(admin.StackedInline):
    model = QuestionAnswer


class HelpAdmin(admin.ModelAdmin):
    inlines = (QuestionAnswerInline, )


class UserAdmin(admin.ModelAdmin):
    pass


admin.site.register(user, UserAdmin)
admin.site.register(JobFeed, JobFeedAdmin)
admin.site.register(Help, HelpAdmin)
