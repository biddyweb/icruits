from django.conf.urls import (
    url,
    include
)
from rest_framework import routers
from web.viewsets import (
    JobFeedViewSet,
    QueueViewSet,
    HelpViewSet,
    LoginViewSet,
    LogoutViewSet,
    UserViewSet,
    CheckUserViewSet,
    LocationViewSet,
    IndustryViewSet,
    CompanyTypeViewSet,
    SalaryRangeViewSet,
    WaitIntervalViewSet,
    OnJobSuccessViewSet,
    JobTypeViewSet,
    JobDurationViewSet,
    ExperienceLevelViewSet,
    BlueprintTasksViewSet,
    VisaStatusViewSet,
    UserListViewSet,
    WorkEnviormentViewSet,
    CreateBlueprintViewSet,
    MobileLogin,
)
from libs.djoser.views import (
    RegistrationView,
    SetUsernameView,
    SetPasswordView,
    PasswordResetView,
    PasswordResetConfirmView,
    RootView,
)
from rest_framework_jwt.views import (
    obtain_jwt_token,
    verify_jwt_token
)
from django.contrib.auth import get_user_model

User = get_user_model()


router = routers.DefaultRouter()
router.register(r'job', JobFeedViewSet, base_name='job')
router.register(r'help', HelpViewSet, base_name='help')
router.register(r'queue', QueueViewSet, base_name='queue')
router.register(r'location', LocationViewSet, base_name='location')
router.register(r'industry', IndustryViewSet, base_name='industry')
router.register(r'company-type', CompanyTypeViewSet, base_name='company-type')
router.register(r'salary-range', SalaryRangeViewSet, base_name='salary-range')
router.register(r'wait-interval', WaitIntervalViewSet, base_name='wait-interval')
router.register(r'on-job-success', OnJobSuccessViewSet, base_name='on-job-success')
router.register(r'job-type', JobTypeViewSet, base_name='job-type')
router.register(r'job-duration', JobDurationViewSet, base_name='job-duration')
router.register(r'experience-level', ExperienceLevelViewSet, base_name='experience-level')
router.register(r'blueprint-tasks', BlueprintTasksViewSet, base_name='blueprint-tasks')
router.register(r'visa-status', VisaStatusViewSet, base_name='visa-status')
router.register(r'user-list', UserListViewSet, base_name='user-list')

base_urlpatterns = (
    url(r'^auth/register/$', RegistrationView.as_view(), name='register'),
    #url(r'^auth/{0}/$'.format(User.USERNAME_FIELD), SetUsernameView.as_view(), name='set_username'),
    #url(r'^auth/password/$', SetPasswordView.as_view(), name='set_password'),
    url(r'^auth/password/reset/$', PasswordResetView.as_view(), name='password/reset'),
    url(r'^auth/password/reset/confirm/$', PasswordResetConfirmView.as_view(), name='password/reset/confirm'),
    url(r'^auth/login/$', LoginViewSet.as_view(), name='login_'),
    url(r'^auth/logout/$', LogoutViewSet.as_view(), name='logout_'),
    url(r'^auth/whoami/', UserViewSet.as_view(), name='whoami'),
    url(r'^auth/get-jtw-token/', obtain_jwt_token, name='get-jwt'),
    url(r'^auth/check-jwt-token/', verify_jwt_token, name='check-jwt-token'),
    url(r'^auth/check-user/', CheckUserViewSet.as_view(), name='check-user'),
)

urlpatterns = base_urlpatterns + (
    url(r'^auth/$', RootView.as_view(
        urls_extra_mapping={'login': 'login_', 'logout': 'logout_', 'whoami': 'whoami',
                            'get-jtw-token': 'get-jtw-token', 'check-jwt-token': 'check-jwt-token', }
    ), name='root'),
    url(r'^', include(router.urls)),
    #url(r'^queue', QueueViewSet.as_view(), name='queue'),
    url(r'^work-enviorment/', WorkEnviormentViewSet.as_view({'post': 'create'}), name='work-enviorment'),
    url(r'^create-blueprint/', CreateBlueprintViewSet.as_view({'post': 'create'}), name='create-blueprint'),
    url(r'^mobile-login/', MobileLogin.as_view(), name='mobile-login'),
)
