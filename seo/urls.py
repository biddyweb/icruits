from django.conf.urls import (
    url,
    include
)
from rest_framework.routers import DefaultRouter
from seo.viewsets import MetaTagsViewSet


router = DefaultRouter()
router.register(r'metaTags', MetaTagsViewSet, base_name='metaTags')

urlpatterns = [
    url(r'^', include(router.urls)),
]
