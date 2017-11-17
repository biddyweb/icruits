from django.contrib import admin
from web.models import (
    Blueprint,
    QuestionAnswer,
    Help,
    user,
    Industry,
    CompanyType,
    SalaryRange,
    WaitInterval,
    OnJobSuccess,
    JobType,
    JobDuration,
    ExperienceLevel,
    Queue,
    BlueprintTasks,
    ProfileType,
    Location,
    Visa,
    TestPilots,
    DesiredEmployee,
    Subscribed
)


# Register your models here.
class DesiredEmployeeAdmin(admin.ModelAdmin):
    pass


class TestPilotsAdmin(admin.ModelAdmin):
    pass


class VisaAdmin(admin.ModelAdmin):
    pass


class IndustryAdmin(admin.ModelAdmin):
    pass


class CompanyTypeAdmin(admin.ModelAdmin):
    pass


class SalaryRangeAdmin(admin.ModelAdmin):
    pass


class WaitIntervalAdmin(admin.ModelAdmin):
    pass


class OnJobSuccessAdmin(admin.ModelAdmin):
    pass


class JobTypeAdmin(admin.ModelAdmin):
    pass


class JobDurationAdmin(admin.ModelAdmin):
    pass


class ExperienceLevelAdmin(admin.ModelAdmin):
    pass


class QueueAdmin(admin.ModelAdmin):
    pass


class QuestionAnswerInline(admin.StackedInline):
    model = QuestionAnswer


class HelpAdmin(admin.ModelAdmin):
    inlines = (QuestionAnswerInline, )


class UserAdmin(admin.ModelAdmin):
    pass


class ProfileTypeAdmin(admin.ModelAdmin):
    pass


class LocationAdmin(admin.ModelAdmin):
    pass


class BlueprintAdmin(admin.ModelAdmin):
    pass


class BlueprintTasksAdmin(admin.ModelAdmin):
    pass


class SubscribedAdmin(admin.ModelAdmin):
    pass


admin.site.register(user, UserAdmin)
admin.site.register(Help, HelpAdmin)
admin.site.register(Industry, IndustryAdmin)
admin.site.register(CompanyType, CompanyTypeAdmin)
admin.site.register(SalaryRange, SalaryRangeAdmin)
admin.site.register(WaitInterval, WaitIntervalAdmin)
admin.site.register(OnJobSuccess, OnJobSuccessAdmin)
admin.site.register(JobType, JobTypeAdmin)
admin.site.register(JobDuration, JobDurationAdmin)
admin.site.register(ExperienceLevel, ExperienceLevelAdmin)
admin.site.register(Queue, QueueAdmin)
admin.site.register(BlueprintTasks, BlueprintTasksAdmin)
admin.site.register(Blueprint, BlueprintAdmin)
admin.site.register(ProfileType, ProfileTypeAdmin)
admin.site.register(Location, LocationAdmin)
admin.site.register(Visa, VisaAdmin)
admin.site.register(TestPilots, TestPilotsAdmin)
admin.site.register(DesiredEmployee, DesiredEmployeeAdmin)
admin.site.register(Subscribed, SubscribedAdmin)
