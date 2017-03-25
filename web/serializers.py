from web.models import (
    Blueprint,
    QuestionAnswer,
    Help,
    Industry,
    CompanyType,
    SalaryRange,
    WaitInterval,
    OnJobSuccess,
    JobType,
    JobDuration,
    ExperienceLevel,
    Queue,
    BlueprintTasks,
    Location,
)
from rest_framework import serializers
from libs.djoser.serializers import UserSerializer


class LocationSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Location
        fields = '__all__'


class IndustrySerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Industry
        fields = '__all__'


class CompanyTypeSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = CompanyType
        fields = '__all__'


class SalaryRangeSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = SalaryRange
        fields = '__all__'


class WaitIntervalSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = WaitInterval
        fields = '__all__'


class OnJobSuccessSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = OnJobSuccess
        fields = '__all__'


class JobTypeSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = JobType
        fields = '__all__'


class JobDurationSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = JobDuration
        fields = '__all__'


class ExperienceLevelSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = ExperienceLevel
        fields = '__all__'


class BlueprintTasksSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlueprintTasks
        fields = '__all__'


class BlueprintSerializer(serializers.ModelSerializer):

    industry = IndustrySerializer(many=False, read_only=True)
    company_type = CompanyTypeSerializer(many=False, read_only=True)
    salary_range = SalaryRangeSerializer(many=False, read_only=True)
    wait_interval = WaitIntervalSerializer(many=False, read_only=True)
    on_success = OnJobSuccessSerializer(many=False, read_only=True)
    job_type = JobTypeSerializer(many=False, read_only=True)
    duration = JobDurationSerializer(many=False, read_only=True)
    experience = ExperienceLevelSerializer(many=False, read_only=True)
    blueprint_user = UserSerializer(many=False, read_only=True)
    blueprint_tasks = BlueprintTasksSerializer(many=False, read_only=True)
    job_location = LocationSerializer(many=False, read_only=True)

    class Meta:
        model = Blueprint
        fields = '__all__'
        #extra_kwargs = {
        #    'url': {'lookup_field': 'name_slug'}
        #}


class QuestionAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuestionAnswer
        fields = ('question', 'answer', 'id', )


class HelpSerializer(serializers.ModelSerializer):

    questionAnswer = QuestionAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Help
        fields = '__all__'


class QueueSerializer(serializers.ModelSerializer):
    blueprint_name = BlueprintSerializer(many=False, read_only=True)
    candidate_name = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Queue
        fields = '__all__'