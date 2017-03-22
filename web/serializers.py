from web.models import (
    JobFeed,
    QuestionAnswer,
    Help,
)
from rest_framework import serializers


class JobFeedSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobFeed
        fields = '__all__'
        lookup_field = 'job_name_slug'


class QuestionAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuestionAnswer
        fields = ('question', 'answer', 'id', )


class HelpSerializer(serializers.ModelSerializer):

    questionAnswer = QuestionAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Help
        fields = '__all__'
