from django.conf.urls import (
    url,
    include
)
from rest_framework.routers import DefaultRouter
from seo.viewsets import MetaTagsViewSet


router = DefaultRouter()
router.register(r'meta_tags', MetaTagsViewSet, base_name='meta_tags')

urlpatterns = [
    url(r'^', include(router.urls)),
]
