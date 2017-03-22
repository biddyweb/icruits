from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny
from seo.models import MetaTags
from seo.serializers import MetaTagsSerializer


# Create your views here.
class MetaTagsViewSet(ReadOnlyModelViewSet):
    queryset = MetaTags.objects.all()
    serializer_class = MetaTagsSerializer
    permission_classes = [
        AllowAny,
    ]
    lookup_field = 'page_name'
