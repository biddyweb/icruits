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

number_validator = RegexValidator(r'^[0-9+]*$', 'Must be numbers only')


# Create your models here.
#
# This part is serving as choices for our model

INDUSTRY_SOFTWARE = 0
INDUSTRY_ACCOUNTING = 1
INDUSTRY_HEALTHCARE = 2

INDUSTRY_TYPE = ((INDUSTRY_SOFTWARE, 'Software'),
                 (INDUSTRY_ACCOUNTING, 'Accounting'),
                 (INDUSTRY_HEALTHCARE, 'HealthCare'))


TYPE_STARTUP = 0
TYPE_NATIONAL = 1
TYPE_MNCS = 2

COMPANY_TYPE = ((TYPE_STARTUP, 'StartUp'),
                (TYPE_NATIONAL, 'National'),
                (TYPE_MNCS, 'MNCs'))

EXPERIENCE_LOW = 0
EXPERIENCE_MEDIUM = 1
EXPERIENCE_HIGH = 2
EXPERIENCE_TRAINEE = 3

EXPERIENCE_TYPE = ((EXPERIENCE_LOW, 'Fresher'),
                   (EXPERIENCE_MEDIUM, 'Intern'),
                   (EXPERIENCE_HIGH, 'Experienced'),
                   (EXPERIENCE_TRAINEE, 'Trainee'))

JOB_PART = 0
JOB_FULL = 1

JOB_TYPE = ((JOB_PART, 'Part Time'),
            (JOB_FULL, 'Full Time'))

WEEK_DURATION = 0
TWO_WEEKS_DURATION = 1
MONTH_DURATION = 2

JOB_DURATION = ((WEEK_DURATION, '7 Days'),
                (TWO_WEEKS_DURATION, '15 Days'),
                (MONTH_DURATION, '1 Month'))


class JobFeed(models.Model):
    job_name = models.CharField(_('Job Name'), max_length=255)
    job_name_slug = models.SlugField(_('Job Name Slug'), max_length=30, unique=True)
    job_description = models.TextField(_('Job Description'))
    industry = models.IntegerField(_('Industry Type'), choices=INDUSTRY_TYPE, default=INDUSTRY_SOFTWARE)
    company_type = models.IntegerField(_('Company Type'), choices=COMPANY_TYPE)
    location = models.CharField(_('Location'), max_length=255)
    function = models.CharField(_('Job Function'), max_length=255)
    experience = models.IntegerField(_('Experience Level'), choices=EXPERIENCE_TYPE)
    salary = models.CharField(_('Job Salary'), max_length=255)
    job_type = models.IntegerField(_('Join Type'), choices=JOB_TYPE)
    duration = models.IntegerField(_('Job Duration'), choices=JOB_DURATION)
    queue = models.PositiveIntegerField(default=1)

    def __unicode__(self):
        return self.job_name

    def get_absolute_url(self):
        return '/job/' + str(self.job_name_slug)

    class Meta:
        verbose_name = 'Job Feed'
        verbose_name_plural = 'Job Feeds'


class Help(models.Model):
    title = models.CharField(_('Help'), max_length=255)
    description = models.CharField(_('Description'), max_length=255)
    content = models.TextField()

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = 'Help'


class QuestionAnswer(models.Model):
    question = models.CharField(_('Question'), max_length=255)
    answer = models.TextField()
    qa = models.ForeignKey(Help, related_name='questionAnswer')

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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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


PROFILE_TYPE = (('JobSeeker', 'JobSeeker'),
                ('Employer', 'Employer'))


class ProfileType(models.Model):
    account_type = models.CharField(choices=PROFILE_TYPE, max_length=122)
    acc_type = models.ForeignKey(user, related_name='profile_type')

    class Meta:
        verbose_name = 'Profile Type'
