from web.models import (
    Blueprint,
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
    user,
)
from web.serializers import (
    BlueprintSerializer,
    HelpSerializer,
    QueueSerializer,
    IndustrySerializer,
    CompanyTypeSerializer,
    SalaryRangeSerializer,
    WaitIntervalSerializer,
    OnJobSuccessSerializer,
    JobTypeSerializer,
    JobDurationSerializer,
    ExperienceLevelSerializer,
    BlueprintTasksSerializer,
    LocationSerializer,
    VisaSerializer,
)
from rest_framework import (
    viewsets,
    response,
    permissions,
    mixins,
    views,
    renderers,
    status,
    generics,
)
import json
from django.contrib.auth import (
    logout,
    login,
    authenticate,
)
from django.contrib.auth import get_user_model
from libs.djoser import serializers
User = get_user_model()


# Create your views here.
class CreateListRetrieveViewSet(mixins.CreateModelMixin,
                                mixins.ListModelMixin,
                                mixins.RetrieveModelMixin,
                                viewsets.GenericViewSet):
    """abstract class for create, list, retrieve methods"""
    pass


class JobFeedViewSet(viewsets.ModelViewSet):
    """
    Blueprints endpoint
    """
    queryset = Blueprint.objects.all()
    serializer_class = BlueprintSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        #permissions.AllowAny,
    ]
    lookup_field = 'name_slug'


class QueueViewSet(viewsets.ModelViewSet):
    """
    Queue viewset api endpoint
    """
    queryset = Queue.objects.all()
    serializer_class = QueueSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        #permissions.AllowAny,
    ]

#class QueueViewSet(views.APIView):
    #queryset = Blueprint.objects.all()
    #renderer_classes = [
    #    renderers.JSONRenderer,
    #]
    #permission_classes = [
    #    permissions.IsAuthenticated,
    #]

    #def get(self, request, format=None):
    #    queues = Blueprint.objects.all()
    #    job_queue = request.query_params.get('queue')
    #    if job_queue:
    #        queues = queues.filter(queue=job_queue)
    #    content = {'job_queue': queues}
        # za django 1.10 koristiti json dumps
    #    return response.Response(json.dumps(content), content_type='application/json; charset=utf-8')
        #return response.Response(content, content_type='application/json; charset=utf-8')


class HelpViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Help api viewset endpoint
    """
    queryset = Help.objects.all()
    serializer_class = HelpSerializer
    permission_classes = [
        permissions.AllowAny,
    ]


class LogoutViewSet(views.APIView):
    """
    Logout api view endpoint
    """
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request, format=None):
        logout(request)

        return response.Response({
            'status': "Unauthorized",
            'message': "Logged out successfully"
        }, status=status.HTTP_204_NO_CONTENT)


class LoginViewSet(views.APIView):
    """
    Login api endpoint
    """
    permission_classes = [
        permissions.AllowAny,
    ]

    def post(self, request, format=None):

        try:
            data = json.loads(request.body)
        except Exception as e:
            return response.Response({
                'status': 'Authorized',
                'message': 'Already logged in'
            }, status=status.HTTP_400_BAD_REQUEST)

        username_ = data.get('username')
        password_ = data.get('password')

        account = authenticate(username=username_, password=password_)

        if account is not None:
            login(request, account)

            return response.Response({
                'status': 'OK',
                'user': username_
            }, status=status.HTTP_200_OK)
        else:
            return response.Response({
                'status': "Unauthorized",
                'message': "Wrong username or password"
            }, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(generics.RetrieveUpdateDestroyAPIView):
    """
    Use this endpoint to retrieve/update user.
    """
    model = User
    serializer_class = serializers.serializers_manager.get('user')
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_object(self, *args, **kwargs):
        return self.request.user


class CheckUserViewSet(views.APIView):
    """
    Use this endpoint to check user.
    """
    permission_classes = [
        permissions.AllowAny,
    ]

    def post(self, request, format=None):
        data = request.read().replace('"', '').replace('{', '').replace('}', '')

        try:
            user = data.split(':')[1]

            checkUser = User.objects.filter(username=user)

            if checkUser:
                return response.Response(status=status.HTTP_200_OK)
            else:
                return response.Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return response.Response(status=status.HTTP_201_CREATED)


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Location endpoint api
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class IndustryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Industry viewset api endpoint
    """
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class CompanyTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Company Type viewset api endpoint
    """
    queryset = CompanyType.objects.all()
    serializer_class = CompanyTypeSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class SalaryRangeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Salary Range viewset endpoint
    """
    queryset = SalaryRange.objects.all()
    serializer_class = SalaryRangeSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class WaitIntervalViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Wait Interval viewset endpoint
    """
    queryset = WaitInterval.objects.all()
    serializer_class = WaitIntervalSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class OnJobSuccessViewSet(viewsets.ReadOnlyModelViewSet):
    """
    On Job Success viewset endpoint
    """
    queryset = OnJobSuccess.objects.all()
    serializer_class = OnJobSuccessSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class JobTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Job Type viewset endpoint
    """
    queryset = JobType.objects.all()
    serializer_class = JobTypeSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class JobDurationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Job Duration viewset endpoint
    """
    queryset = JobDuration.objects.all()
    serializer_class = JobDurationSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class ExperienceLevelViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Experience Level viewset endpoint 
    """
    queryset = ExperienceLevel.objects.all()
    serializer_class = ExperienceLevelSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class BlueprintTasksViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Blueprint Tasks viewset endpoint
    """
    queryset = BlueprintTasks.objects.all()
    serializer_class = BlueprintTasksSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class VisaStatusViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Visa Status viewset endpoint
    """
    queryset = Visa.objects.all()
    serializer_class = VisaSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class UserListViewSet(viewsets.ReadOnlyModelViewSet):
    """
    User list viewset
    """
    queryset = user.objects.all()
    serializer_class = serializers.serializers_manager.get('user')
    permission_classes = [
        permissions.IsAuthenticated,
    ]
