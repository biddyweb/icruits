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
    url(r'^auth/check-jwt-token/', verify_jwt_token, name='check-jwt-token')
)

urlpatterns = base_urlpatterns + (
    url(r'^auth/$', RootView.as_view(
        urls_extra_mapping={'login': 'login_', 'logout': 'logout_', 'whoami': 'whoami',
                            'get-jtw-token': 'get-jtw-token', 'check-jwt-token': 'check-jwt-token', }
    ), name='root'),
    url(r'^', include(router.urls)),
    url(r'^queue', QueueViewSet.as_view(), name='queue'),
)
