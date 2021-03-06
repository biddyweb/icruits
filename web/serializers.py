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
    Visa,
    WorkEnviorment,
    DesiredEmployee,
    TestPilots,
    QueueStack,
    AppliedBlueprints,
    PrehiredEmployee,
    HiredEmployee,
    WorkEnviorment2,
    WaitingListToEnterStack,
    InterviewDateAndTime,
    Subscribed
)
from rest_framework import serializers
from libs.djoser.serializers import UserSerializer
from libs.image_thumbnailer import get_responsive_image_url


class SubscribedSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subscribed
        fields = '__all__'


class VisaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Visa
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Location
        fields = '__all__'


class IndustrySerializer(serializers.ModelSerializer):

    class Meta:
        model = Industry
        fields = '__all__'


class CompanyTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompanyType
        fields = '__all__'


class SalaryRangeSerializer(serializers.ModelSerializer):

    class Meta:
        model = SalaryRange
        fields = '__all__'


class WaitIntervalSerializer(serializers.ModelSerializer):

    class Meta:
        model = WaitInterval
        fields = '__all__'


class OnJobSuccessSerializer(serializers.ModelSerializer):

    class Meta:
        model = OnJobSuccess
        fields = '__all__'


class JobTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobType
        fields = '__all__'


class JobDurationSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobDuration
        fields = '__all__'


class ExperienceLevelSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExperienceLevel
        fields = '__all__'


class DesiredEmployeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = DesiredEmployee
        fields = '__all__'


class BlueprintTasksSerializer(serializers.ModelSerializer):

    desired_employees = DesiredEmployeeSerializer(many=True, read_only=True)

    class Meta:
        model = BlueprintTasks
        fields = '__all__'


class TestPilotsSerializer(serializers.ModelSerializer):

    class Meta:
        model = TestPilots
        fields = ('id', 'email', 'name', )


class CustomImageField(serializers.ImageField):
    read_only = True

    def to_representation(self, value):
        try:
            data = get_responsive_image_url(value, self.context['request'].GET.get('image_size', ''))
            data = data.replace('/media/media/', '/media/')
            return data
        except:
            pass

    def to_internal_value(self, data):
        return data


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
    blueprint_tasks = BlueprintTasksSerializer(many=True, read_only=True)
    job_location = LocationSerializer(many=False, read_only=True)
    work_enviorment = CustomImageField()
    work_enviorment_2 = CustomImageField()
    visa_status = VisaSerializer(many=False, read_only=True)

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


class QueueStackSerializer(serializers.ModelSerializer):

    candidate_name = UserSerializer(many=False, read_only=True)

    class Meta:
        model = QueueStack
        fields = '__all__'


class QueueSerializer(serializers.ModelSerializer):
    blueprint_name = BlueprintSerializer(many=False, read_only=True)
    queue_stack = QueueStackSerializer(many=True, read_only=True)

    class Meta:
        model = Queue
        fields = '__all__'


class WorkEnviormentSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkEnviorment
        fields = '__all__'


class WorkEnviorment2Serializer(serializers.ModelSerializer):

    class Meta:
        model = WorkEnviorment2
        fields = '__all__'


class AppliedBlueprintsSerializer(serializers.ModelSerializer):
    related_blueprint = BlueprintSerializer(many=False, read_only=True)
    related_candidate = UserSerializer(many=False, read_only=True)

    class Meta:
        model = AppliedBlueprints
        fields = '__all__'


class InterviewDateTimeSerializer(serializers.ModelSerializer):
    related_time_and_date_for_blueprint = BlueprintSerializer(many=False, read_only=True)

    class Meta:
        model = InterviewDateAndTime
        fields = '__all__'


class PrehiredEmployeeSerializer(serializers.ModelSerializer):
    related_blueprint_id = BlueprintSerializer(many=False, read_only=True)
    related_user_id = UserSerializer(many=False, read_only=True)
    related_timedate = InterviewDateTimeSerializer(many=True, read_only=True)

    class Meta:
        model = PrehiredEmployee
        fields = '__all__'


class HiredEmployeeSerializer(serializers.ModelSerializer):
    related_hired_blueprint = BlueprintSerializer(many=False, read_only=True)
    related_hired_user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = HiredEmployee
        fields = '__all__'


class WaitingListToEnterStackSerializer(serializers.ModelSerializer):
    related_blueprint_model = BlueprintSerializer(many=False, read_only=True)
    related_user_model = UserSerializer(many=False, read_only=True)

    class Meta:
        model = WaitingListToEnterStack
        fields = '__all__'
