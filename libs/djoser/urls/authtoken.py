from django.conf.urls import url
from libs.djoser import views
from libs.djoser.urls import base

urlpatterns = base.base_urlpatterns + (
    url(r'^login/$', views.LoginView.as_view(), name='login'),
    url(r'^logout/$', views.LogoutView.as_view(), name='logout'),
    url(r'^$', views.RootView.as_view(urls_extra_mapping={'login': 'login', 'logout': 'logout'}), name='root'),
)
