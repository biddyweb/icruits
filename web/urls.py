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
    TestPilotsViewSet,
    CreateBlueprintTasksViewSet,
    DesiredEmployeeViewSet,
    QueueStackViewSet,
    AppliedBlueprintsViewSet,
    ReviewResultsViewSet,
    PrehiredEmployeeViewSet,
    BlueprintsCandidateHasAppliedViewSet,
    HiredEmployeeViewSet,
    CheckUsernameViewSet,
    WorkEnviorment2ViewSet,
    SubscribedViewSet
)
from libs.djoser.views import (
    RegistrationView,
    SetUsernameView,
    SetPasswordView,
    PasswordResetView,
    PasswordResetConfirmView,
    RootView,
    ActivationView,
)
from rest_framework_jwt.views import (
    obtain_jwt_token,
    verify_jwt_token
)
from django.contrib.auth import get_user_model

User = get_user_model()


router = routers.DefaultRouter()
router.register(r'job', JobFeedViewSet, base_name='dashboard')
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
router.register(r'desired-employee', DesiredEmployeeViewSet, base_name='desired-employee')
router.register(r'queue-stack', QueueStackViewSet, base_name='queue-stack')
router.register(r'applied-blueprints', AppliedBlueprintsViewSet, base_name='applied-blueprints')
router.register(r'prehired-employee', PrehiredEmployeeViewSet, base_name='prehired-employee')
router.register(r'hired-employee', HiredEmployeeViewSet, base_name='hired-employee')
router.register(r'subscribed', SubscribedViewSet, base_name='subscribed')

base_urlpatterns = (
    url(r'^auth/register/$', RegistrationView.as_view(), name='register'),
    #url(r'^auth/{0}/$'.format(User.USERNAME_FIELD), SetUsernameView.as_view(), name='set_username'),
    #url(r'^auth/password/$', SetPasswordView.as_view(), name='set_password'),
    url(r'^auth/password/reset/$', PasswordResetView.as_view(), name='password/reset'),
    url(r'^auth/password/reset/confirm/$', PasswordResetConfirmView.as_view(), name='password/reset/confirm'),
    url(r'^auth/login/$', LoginViewSet.as_view(), name='login_'),
    url(r'^auth/logout/$', LogoutViewSet.as_view(), name='logout_'),
    url(r'^auth/whoami/$', UserViewSet.as_view(), name='profile'),
    url(r'^auth/get-jtw-token/$', obtain_jwt_token, name='get-jwt'),
    url(r'^auth/check-jwt-token/$', verify_jwt_token, name='check-jwt-token'),
    url(r'^auth/check-user/$', CheckUserViewSet.as_view(), name='check-user'),
    url(r'^auth/check-username/$', CheckUsernameViewSet.as_view(), name='check-username'),
    url(r'^auth/activate/$', ActivationView.as_view(), name='activate'),
)

urlpatterns = base_urlpatterns + (
    url(r'^auth/$', RootView.as_view(
        urls_extra_mapping={'login': 'login_', 'logout': 'logout_', 'whoami': 'whoami',
                            'get-jtw-token': 'get-jtw-token', 'check-jwt-token': 'check-jwt-token', }
    ), name='root'),
    url(r'^', include(router.urls)),
    #url(r'^queue', QueueViewSet.as_view(), name='queue'),
    url(r'^work-enviorment/$', WorkEnviormentViewSet.as_view({'post': 'create'}), name='work-enviorment'),
    url(r'^work-enviorment2/$', WorkEnviorment2ViewSet.as_view({'post': 'create'}), name='work-enviorment2'),
    url(r'^create-blueprint/$', CreateBlueprintViewSet.as_view({'post': 'create'}), name='create-blueprint'),
    url(r'^create-blueprint-tasks/$', CreateBlueprintTasksViewSet.as_view({'post': 'create'}), name='create-blueprint-task'),
    url(r'^mobile-login/$', MobileLogin.as_view(), name='mobile-login'),
    url(r'^test-pilots/$', TestPilotsViewSet.as_view({'get': 'list'}), name='pilots'),
    url(r'^review-results/$', ReviewResultsViewSet.as_view(), name='review-results'),
    url(r'^mobile-all-blueprints/$', BlueprintsCandidateHasAppliedViewSet.as_view(), name='mobile-all-blueprints'),
)
