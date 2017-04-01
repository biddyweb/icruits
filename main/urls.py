"""websource URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import (
    url,
    include
)
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic.base import TemplateView
from hide_herokuapp.views import herokuapp_robots_view
from django.contrib.sitemaps.views import sitemap
from main.sitemaps import (
    HomeSitemap,
    BlueprintSitemap,
    HelpSitemap,
)

sitemaps = {
    'home': HomeSitemap,
    'jobs': BlueprintSitemap,
    'help': HelpSitemap,
}

admin.autodiscover()

urlpatterns = [
    url(r'^admin/', include('libs.djadmin.urls')),
    url(r'^api/', include('web.urls')),
    url(r'^api/seo/', include('seo.urls')),
    url(r'^$', TemplateView.as_view(template_name='main.html'), name="home"),
    url(r'^sitemap\.xml$', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    url(r'^robots\.txt$', herokuapp_robots_view, name='robots'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    url(r'^.*/$', TemplateView.as_view(template_name='main.html'))
]

