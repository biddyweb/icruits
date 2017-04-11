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
    WorkEnviorment,
    TestPilots,
    QueueStack,
    DesiredEmployee,
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
    WorkEnviormentSerializer,
    TestPilotsSerializer,
    DesiredEmployeeSerializer,
)
from rest_framework import (
    viewsets,
    response,
    permissions,
    mixins,
    views,
    status,
    generics,
    parsers,
)
import json
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.auth import (
    logout,
    login,
    authenticate,
)
from django.contrib.auth import get_user_model
from libs.djoser import serializers
from django.core.mail import send_mail
from django.template.loader import render_to_string
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
    ]

    def create(self, request, *args, **kwargs):

        blueprint_id = request.data['blueprint']

        initial_stack = QueueStack(candidate_position=0)
        initial_stack.save()

        serializer = QueueSerializer(data={'blueprint': blueprint_id})
        if serializer.is_valid():
            self.perform_create(serializer)

            get_id = Queue.objects.filter(blueprint=request.data['blueprint']).first()

            get_id.stack.add(initial_stack)
            #get_id.stack.save(initial_stack)

            headers_ = self.get_success_headers(serializer.data)
            return response.Response(data=serializer.data,
                                     status=status.HTTP_201_CREATED,
                                     headers=headers_)
        else:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


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

            checkUser = User.objects.filter(email=user)

            if checkUser:
                return response.Response(status=status.HTTP_200_OK)
            else:
                return response.Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return response.Response(status=status.HTTP_201_CREATED)


class MobileLogin(views.APIView):
    """
    Endpoint for mobile logins
    """
    permission_classes = [
        permissions.AllowAny,
    ]

    def post(self, request, format=None):

        try:
            data = json.load(request)
        except Exception as e:
            data = json.dumps({'exists':False}, sort_keys=True, indent=4, separators=(',', ': '))
            return response.Response(data, status=status.HTTP_400_BAD_REQUEST)

        username_ = data.get('username')
        password_ = data.get('password')

        s = SessionStore()
        s.create()
        session_id = s.session_key

        account = authenticate(username=username_, password=password_)

        if account:
            data = json.dumps({'exists':True, 'session_id':session_id}, sort_keys=True, indent=4, separators=(',', ': '))
            return response.Response(data, status=status.HTTP_200_OK)
        else:
            data = json.dumps({'exists':False, 'session_id':session_id}, sort_keys=True, indent=4, separators=(',', ': '))
            return response.Response(data, status=status.HTTP_400_BAD_REQUEST)


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


class WorkEnviormentViewSet(viewsets.ModelViewSet):
    queryset = WorkEnviorment.objects.all()
    serializer_class = WorkEnviormentSerializer
    permission_classes = [
        permissions.AllowAny,
    ]
    parser_classes = [
        parsers.MultiPartParser,
    ]

    def create(self, request, *args, **kwargs):

        if not request.session.exists(request.session.session_key):
            request.session.create()

        image = request.data['file']

        serializer = WorkEnviormentSerializer(data={'image': image,
                                                    'session': request.session.session_key})

        if serializer.is_valid():

            self.perform_create(serializer)

            _old_session = WorkEnviorment.objects.filter(session=request.session.session_key).first()

            if _old_session:
                self.perform_destroy(_old_session)

            _headers = self.get_success_headers(serializer.data)

            return response.Response(serializer.data, status=status.HTTP_201_CREATED, 
                                     headers=_headers)
        else:
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TestPilotsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TestPilots.objects.all()
    serializer_class = TestPilotsSerializer
    permission_classes = [
        permissions.AllowAny,
    ]


class BlueprintTasksViewSet(viewsets.ModelViewSet):
    """
    Blueprint Tasks viewset endpoint
    """
    queryset = BlueprintTasks.objects.all()
    serializer_class = BlueprintTasksSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


class CreateBlueprintTasksViewSet(viewsets.ModelViewSet):
    """
    Blueprint tasks creation endpoint
    """
    queryset = BlueprintTasks.objects.all()
    serializer_class = BlueprintSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def create(self, request, *args, **kwargs):
        pass


class CreateBlueprintViewSet(viewsets.ModelViewSet):
    queryset = Blueprint.objects.all()
    serializer_class = BlueprintSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def create(self, request, *args, **kwargs):

        request_data = request.data[0]
        tasks_data = request.data[1]
        employee_data = request.data[2]

        job_dur = request_data['related_job_duration']
        t_id = request_data['team_id']
        wait_int = request_data['related_wait_interval']
        prof_qual = request_data['professional_qualifications']
        rel_succ = request_data['related_on_success']
        job_t = request_data['related_job_type']
        company_t = request_data['related_company_type']
        comapny_n = request_data['company_name']
        rel_ind = request_data['related_industry']
        work_env = request_data['work_enviorment']
        rel_loc = request_data['related_location']
        fun = request_data['function']
        rel_sal = request_data['related_salary']
        prac_lim = request_data['practice_limit']
        max_q = request_data['max_queue']
        nam = request_data['name']
        blue_url = request_data['url']
        remote_w = request_data['remote_work']

        tasks = tasks_data['tasks']

        employees = employee_data['employee']

        rel_exp = request_data['related_experience']
        rel_visa = request_data['related_visa_status']
        rel_user = request_data['related_user']
        desc = request_data['description']

        # add description!!
        serializer = BlueprintSerializer(data={'name': nam,
                                               'description': desc,
                                               'url': blue_url,
                                               'function': fun,
                                               'professional_qualifications': prof_qual,
                                               'team_id': t_id,
                                               'practice_limit': prac_lim,
                                               'remote_work': remote_w,
                                               'max_queue': max_q,
                                               'company_name': comapny_n,
                                               'work_enviorment': work_env,
                                               'related_location': rel_loc,
                                               'related_industry': rel_ind,
                                               'related_company_type': company_t,
                                               'related_salary': rel_sal,
                                               'related_wait_interval': wait_int,
                                               'related_on_success': rel_succ,
                                               'related_job_type': job_t,
                                               'related_job_duration': job_dur,
                                               'related_experience': rel_exp,
                                               'related_user': rel_user,
                                               'related_visa_status': rel_visa})

        if serializer.is_valid():
            self.perform_create(serializer)

            blueprint_object = Blueprint.objects.last()

            _headers = self.get_success_headers(serializer.data)

            email_context = {
                'bluprint_name': nam,
                'company_name': comapny_n,
                'practice_limit': prac_lim,
                'description': desc
            }

            html_email_content = render_to_string('email_templates/blueprint_created.html', email_context)

            for user_id in str(employees).replace('[', '').replace(']', ''):

                for task in str(tasks):
                    task_obj = BlueprintTasks.objects.filter(id=task).first()

                    task_obj.desired_employee.add(user_id)

                    blueprint_object.related_tasks.add(task_obj)

                user_obj = DesiredEmployee.objects.filter(id=user_id).first()

                send_mail(subject='New Blueprint Created',
                          message='',
                          from_email='alek.rajic@icruits.com',
                          recipient_list=[str(user_obj.email), ],
                          html_message=html_email_content)

            send_mail(subject='New Blueprint Created',
                      message='',
                      from_email='alek.rajic@icruits.com',
                      recipient_list=['lekhaj123btmn@gmail.com',
                                      'paulmanohar5@gmail.com',
                                      'manishbhan@icruits.com',
                                      'alek.rajic@icruits.com', ],
                      html_message=html_email_content)

            return response.Response(serializer.data, status=status.HTTP_201_CREATED, headers=_headers)
        
        else:
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DesiredEmployeeViewSet(viewsets.ModelViewSet):
    queryset = DesiredEmployee.objects.all()
    serializer_class = DesiredEmployeeSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
