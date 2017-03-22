from seo.models import MetaTags
from rest_framework.serializers import ModelSerializer


class MetaTagsSerializer(ModelSerializer):

    class Meta:
        model = MetaTags
        fields = '__all__'
        lookup_field = 'page_name'
