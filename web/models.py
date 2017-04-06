from __future__ import unicode_literals

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.validators import RegexValidator
from django.contrib.auth.validators import (
    ASCIIUsernameValidator,
    UnicodeUsernameValidator
)
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractUser
)
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.utils import six
from django.core.mail import send_mail
from django.conf import settings
from libs.random_id import get_random_id
from django_resized import ResizedImageField

number_validator = RegexValidator(r'^[0-9+]*$', 'Must be numbers only')


# Create your models here.
#
# This part is serving as choices for our model
VISA_STATUS = (('H1B Visa', 'H1B Visa'),
               ('Work Visa', 'Work Visa'))

class Visa(models.Model):
    visa = models.CharField(choices=VISA_STATUS, max_length=255)

    def __unicode__(self):
        return self.visa

    class Meta:
        verbose_name = 'Visa Statu'


LOCATION = (('USA', 'USA'),
            ('Canada', 'Canada'),
            ('Mexico', 'Mexico'),
            ('France', 'France'),
            ('Germany', 'Germany'))


class Location(models.Model):
    location = models.CharField(choices=LOCATION, max_length=255)

    def __unicode__(self):
        return self.location

    class Meta:
        verbose_name = "Location"


EXPERIENCE_LEVEL = (('Fresher', 'Fresher'),
                    ('Intern', 'Intern'),
                    ('Experienced', 'Experienced'),
                    ('Trainee', 'Trainee'))


class ExperienceLevel(models.Model):
    experience_level = models.CharField(choices=EXPERIENCE_LEVEL, max_length=255)

    def __unicode__(self):
        return self.experience_level

    class Meta:
        verbose_name = "Experience Level"


PROFILE_TYPE = (('JobSeeker', 'JobSeeker'),
                ('Employer', 'Employer'))


class ProfileType(models.Model):
    account_type = models.CharField(choices=PROFILE_TYPE, max_length=122)

    def __unicode__(self):
        return self.account_type

    class Meta:
        verbose_name = 'Profile Type'


COMPANY_TYPE = (('StartUp', 'StartUp'),
                ('National', 'National'),
                ('MNCs', 'MNCs'))


class CompanyType(models.Model):
    types_of_company = models.CharField(choices=COMPANY_TYPE, max_length=100)

    def __unicode__(self):
        return self.types_of_company

    class Meta:
        verbose_name = "Company Type"


SALARY_RANGE = (('$10K-$50K', '$10K-$50K'),
                ('$50K-$100K', '$50K-$100K'),
                ('$100K-$200K', '$100K-$200K'),
                ('$200K-$500K', '$200K-$500K'))


class SalaryRange(models.Model):
    sal_range = models.CharField(choices=SALARY_RANGE, max_length=100)

    def __unicode__(self):
        return self.sal_range

    class Meta:
        verbose_name = "Salary Range"


WAIT_TIME = (('Within 7 Days', 'Within 7 Days'),
             ('Within 15 Days', 'Within 15 Days'),
             ('Within Month', 'Within Month'))


class WaitInterval(models.Model):
    response_time = models.CharField(choices=WAIT_TIME, max_length=150)

    def __unicode__(self):
        return self.response_time

    class Meta:
        verbose_name = "Wait Interval"


ON_JOB_SUCCESS = (('Direct Hiring', 'Direct Hiring'),
                  ('Contract', 'Contract'))


class OnJobSuccess(models.Model):
    success = models.CharField(choices=ON_JOB_SUCCESS, max_length=100)

    def __unicode__(self):
        return self.success

    class Meta:
        verbose_name = 'On Success'
        verbose_name_plural = "On Success"


JOB_TYPE = (('Part Time', 'Part Time'),
            ('Full Time', 'Full Time'))


class JobType(models.Model):
    employment = models.CharField(choices=JOB_TYPE, max_length=255)

    def __unicode__(self):
        return self.employment

    class Meta:
        verbose_name = "Job Type"


JOB_DURATION = (('7 Days', '7 Days'),
                ('15 Days', '15 Days'),
                ('1 Month', '1 Month'))


class JobDuration(models.Model):
    job_duration = models.CharField(choices=JOB_DURATION, max_length=125)

    def __unicode__(self):
        return self.job_duration

    class Meta:
        verbose_name = "Job Duration" 


INDUSTRY_TYPE = (('Software', 'Software'),
                 ('Accounting', 'Accounting'),
                 ('HealthCare', 'HealthCare'))


class Industry(models.Model):
    type_industry = models.CharField(choices=INDUSTRY_TYPE, max_length=100)

    def __unicode__(self):
        return self.type_industry

    class Meta:
        verbose_name = "Industry Type"


class Help(models.Model):
    title = models.CharField(_('Help'), max_length=255)
    description = models.CharField(_('Description'), max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = 'Help'


class QuestionAnswer(models.Model):
    question = models.CharField(_('Question'), max_length=255)
    answer = models.TextField()
    qa = models.ForeignKey(Help, related_name='questionAnswer')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return 'Q&A'

    class Meta:
        verbose_name = 'Question & Answer'
        verbose_name_plural = 'Questions & Answers'


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, email, password, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        """
        if not username:
            raise ValueError('The given username must be set')
        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, email, password, **extra_fields)


class user(AbstractUser):
    username_validator = UnicodeUsernameValidator() if six.PY3 else ASCIIUsernameValidator()

    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[username_validator],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    first_name = models.CharField(_('first name'),
                                  max_length=30, blank=True)
    last_name = models.CharField(_('last name'),
                                 max_length=30, blank=True)
    email = models.EmailField(_('email address'), unique=True)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    address = models.CharField(max_length=255, blank=True)
    mobile_number = models.CharField(max_length=255, blank=True, validators=[number_validator])
    location = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # false profile type is employeer and true is jobseeker
    profile_type = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', ]

    def __unicode__(self):
        return self.username

    def get_full_name(self):
        return str(self.first_name + ' ' + self.last_name)

    def get_short_name(self):
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_auth_token(sender, instance=None, created=False, **kwargs):
        if created:
            Token.objects.create(user=instance)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"


class DesiredEmployee(models.Model):
    name = models.CharField(_('Name'), max_length=255)
    email = models.CharField(_('Email Address'), max_length=255)

    class Meta:
        verbose_name = 'Desired Employee'


TASK_STATUS = (('Active', 'Active'),
               ('Finished', 'Finished'),
               ('Canceled', 'Canceled'),
               ('Prolonged', 'Prolonged'))


class BlueprintTasks(models.Model):
    name = models.CharField(_('Task Name'), max_length=255)
    desired_employee = models.ManyToManyField(DesiredEmployee, related_name='desired_employees', blank=True)
    tast_status = models.CharField(choices=TASK_STATUS, max_length=255, blank=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated_At'), auto_now=True)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = "Task"
        verbose_name_plural = "Tasks"


class Blueprint(models.Model):
    name = models.CharField(_('Blueprint Name'), max_length=255)
    name_slug = models.SlugField(_('Blueprint Name Slug'), max_length=255, unique=True, blank=True)
    description = models.TextField(_('Blueprint Description'), blank=True)
    url = models.CharField(_('Blueprint Url'), blank=True, max_length=255)
    function = models.CharField(_('Job Function'), max_length=255)
    professional_qualifications = models.CharField(_('Professional Qualifications'), max_length=255)
    team_id = models.CharField(_('Team ID'), max_length=255)
    practice_limit = models.IntegerField(default=0)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated_At'), auto_now=True)
    is_published = models.BooleanField(_('Blueprint Published'), default=False)
    remote_work = models.CharField(_('Remote Work'), max_length=255)
    max_queue = models.IntegerField(_('Max Queue'), default=10)
    company_name = models.CharField(_('Company Name'), max_length=255)
    work_enviorment = models.ImageField(upload_to="img/work-enviorment/")
    related_location = models.ForeignKey(Location, related_name="job_location")
    related_industry = models.ForeignKey(Industry, related_name="industry")
    related_company_type = models.ForeignKey(CompanyType, related_name="company_type")
    related_salary = models.ForeignKey(SalaryRange, related_name="salary_range")
    related_wait_interval = models.ForeignKey(WaitInterval, related_name="wait_interval")
    related_on_success = models.ForeignKey(OnJobSuccess, related_name="on_success")
    related_job_type = models.ForeignKey(JobType, related_name="job_type")
    related_job_duration = models.ForeignKey(JobDuration, related_name="duration")
    related_experience = models.ForeignKey(ExperienceLevel, related_name="experience")
    related_user = models.ForeignKey(user, related_name="blueprint_user", null=True, blank=True)
    related_tasks = models.ManyToManyField(BlueprintTasks, related_name="blueprint_tasks", blank=True)
    related_visa_status = models.ForeignKey(Visa, related_name="visa_status")

    def __unicode__(self):
        return self.name

    def get_absolute_url(self):
        return '/job/' + str(self.name_slug)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None, **kwargs):
        blueprint_id = get_random_id()
        name_trim = ''.join(e for e in self.name if e.isalnum())
        company_trim = ''.join(e for e in self.company_name if e.isalnum())
        self.name_slug = str(name_trim).lower() + '-' + str(company_trim).lower() + '-' + str(blueprint_id)
        super(Blueprint, self).save(force_insert, force_update, using, update_fields, **kwargs)

    class Meta:
        verbose_name = 'Blueprint'
        verbose_name_plural = 'Blueprints'


CANDIDATE_STATUS = (('Active', 'Active'),
                    ('Hired', 'Hired'),
                    ('Available', 'Available'))


class Queue(models.Model):
    blueprint = models.ForeignKey(Blueprint, related_name="blueprint_name")
    candidate = models.ForeignKey(user, related_name="candidate_name")
    candidate_status = models.CharField(choices=CANDIDATE_STATUS, max_length=255)
    candidate_position = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.candidate_position

    class Meta:
        verbose_name = "Queue"


class WorkEnviorment(models.Model):
    image = ResizedImageField(size=[300, 600], crop=['middle', 'center'], upload_to='img/work-enviorment/temp/')
    session = models.CharField(max_length=511)

    def __unicode__(self):
        return self.session

    class Meta:
        verbose_name = 'Work Enviorment'


class TestPilots(models.Model):
    email = models.CharField(_('Email Address'), max_length=255)

    class Meta:
        verbose_name = 'Test Pilot'
