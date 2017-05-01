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
    AppliedBlueprints,
    PrehiredEmployee,
    HiredEmployee,
    WorkEnviorment2,
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
    QueueStackSerializer,
    AppliedBlueprintsSerializer,
    PrehiredEmployeeSerializer,
    HiredEmployeeSerializer,
    WorkEnviorment2Serializer,
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
    renderers,
)
import json
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.auth import (
    logout,
    login,
    authenticate,
)
from django.http import (
    Http404,
    HttpResponse
)
from django.contrib.auth import get_user_model
from libs.djoser import serializers
from django.core import serializers as serialize
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

            que_id = serializer['id'].value

            get_id = Queue.objects.filter(id=que_id).first()

            get_id.stack.add(initial_stack)
            get_id.stack.save(initial_stack)

            headers_ = self.get_success_headers(serializer.data)
            return response.Response(data=serializer.data,
                                     status=status.HTTP_201_CREATED,
                                     headers=headers_)
        else:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):

        print 'in update queue'

        return response.Response(status=status.HTTP_200_OK)


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
        data = json.loads(request.body)

        user_check = data.get('username')

        checkUser = User.objects.filter(email=user_check)

        if checkUser:
            return response.Response(status=status.HTTP_200_OK)
        else:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class CheckUsernameViewSet(views.APIView):
    """
    Use this endpoint to check user.
    """
    permission_classes = [
        permissions.AllowAny,
    ]

    def post(self, request, format=None):
        data = json.loads(request.body)

        user_check = data.get('username')

        checkUser = User.objects.filter(username=user_check)

        if checkUser:
            return response.Response(status=status.HTTP_200_OK)
        else:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


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

        user_obj = user.objects.filter(email=username_).first()

        s = SessionStore()
        s.create()
        session_id = s.session_key

        account = authenticate(username=username_, password=password_)

        if not user_obj:
            data = json.dumps({'exist': False,
                               'error': 'Wrong email'}, sort_keys=True, indent=4)
            return response.Response(data=data, status=status.HTTP_200_OK)

        if account:
            data = json.dumps({'exist': True,
                               'session_id': session_id,
                               'username': user_obj.username}, sort_keys=True, indent=4)
            #return response.Response({'exist': True,
            #                          'session_id': session_id,
            #                          'username': user_obj.username}, status=status.HTTP_200_OK)
            return response.Response(data, status=status.HTTP_200_OK)
        else:
            data = json.dumps({'exists': False,
                               'error': 'Wrong password'}, sort_keys=True, indent=4)
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


class WorkEnviorment2ViewSet(viewsets.ModelViewSet):
    queryset = WorkEnviorment2.objects.all()
    serializer_class = WorkEnviorment2Serializer
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

        serializer = WorkEnviorment2Serializer(data={'image': image,
                                                    'session': request.session.session_key})

        if serializer.is_valid():

            self.perform_create(serializer)

            _old_session = WorkEnviorment2.objects.filter(session=request.session.session_key).first()

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
        work_env2 = request_data['work_enviorment2']
        rel_loc = request_data['related_location']
        fun = request_data['function']
        rel_sal = request_data['related_salary']
        prac_lim = request_data['practice_limit']
        max_q = request_data['max_queue']
        nam = request_data['name']
        blue_url = request_data['url']
        remote_w = request_data['remote_work']

        tasks = tasks_data['tasks']

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
                                               'work_enviorment_2': work_env2,
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

            blueprint_object_id = serializer['id'].value

            blueprint_object = Blueprint.objects.filter(id=blueprint_object_id).first()

            _headers = self.get_success_headers(serializer.data)

            email_context = {
                'bluprint_name': nam,
                'company_name': comapny_n,
                'practice_limit': prac_lim,
                'description': desc
            }

            html_email_content = render_to_string('email_templates/blueprint_created.html', email_context)

            for task in tasks:

                task_obj = BlueprintTasks.objects.filter(name=task[0]).first()

                for desired_employees in task[1]:

                    user_obj = DesiredEmployee.objects.filter(id=desired_employees).first()
                    task_obj.desired_employee.add(desired_employees)

                    send_mail(subject='New Blueprint Created',
                              message='',
                              from_email='alek.rajic@icruits.com',
                              recipient_list=[str(user_obj.email), ],
                              html_message=html_email_content)

                blueprint_object.related_tasks.add(task_obj)

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


class QueueStackViewSet(viewsets.ModelViewSet):
    queryset = QueueStack.objects.all()
    serializer_class = QueueStackSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def destroy(self, request, *args, **kwargs):

        try:
            instance = self.get_object()
            blueprint_name = Queue.objects.get(stack=instance.id).blueprint.name
            username = instance.candidate.username
            name_trim = ''.join(e for e in username if e.isalnum())
            company_trim = ''.join(e for e in blueprint_name if e.isalnum())
            applied_job_name_slug = str(name_trim).lower() + '-' + str(company_trim).lower()
            user_email = instance.candidate.email
            applied_obj = AppliedBlueprints.objects.filter(name_slug=applied_job_name_slug).first()
            Queue.objects.get(stack=instance.id).stack.remove(instance)
            queue_obj = Queue.objects.get(stack=instance.id)
            pos = 0
            for stack in queue_obj.stack.all():
                stack.candidate_position = pos
                pos += 1
            applied_obj.delete()
            self.perform_destroy(instance)

            email_html_context = {
                'username': username,
                'blueprint': blueprint_name
            }
            html_email = render_to_string('email_templates/left_queue.html', email_html_context)

            send_mail(subject='Left Blueprints Queue',
                      message='',
                      from_email='alek.rajic@icruits.com',
                      recipient_list=[user_email, ],
                      html_message=html_email)

        except Http404:
            pass

        return response.Response(status=status.HTTP_204_NO_CONTENT)


class AppliedBlueprintsViewSet(viewsets.ModelViewSet):
    queryset = AppliedBlueprints.objects.all()
    serializer_class = AppliedBlueprintsSerializer
    permission_classes = [
        permissions.AllowAny,
    ]
    lookup_field = 'name_slug'

    def create(self, request, *args, **kwargs):
        related_candidate = request.data['related_candidate']
        related_blueprint = request.data['related_blueprint']

        serializer = AppliedBlueprintsSerializer(data={'candidate': related_candidate,
                                                       'blueprint': related_blueprint,
                                                       'has_applied': True})

        if serializer.is_valid():
            self.perform_create(serializer)

            user_obj = user.objects.filter(id=related_candidate).first()
            blueprint = Blueprint.objects.filter(id=related_blueprint).first()

            email_context = {
                'username': str(user_obj.username).capitalize(),
                'blueprint': blueprint.name,
                'simulator_url_mac': blueprint.simulator_url_mac,
                'simulator_url_ios': blueprint.simulator_url_ios,
                'simulator_url_win': blueprint.simulator_url_win,
                'simulator_url_android': blueprint.simulator_url_android
            }

            html_email_content = render_to_string('email_templates/applied_to_blueprint.html', email_context)

            send_mail(subject='Applied to Job',
                      message='',
                      from_email='alek.rajic@icruits.com',
                      recipient_list=[str(user_obj.email), ],
                      html_message=html_email_content)

            headers_ = self.get_success_headers(serializer.data)

            return response.Response(data=serializer.data, status=status.HTTP_201_CREATED, headers=headers_)
        else:
            return response.Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            addr = instance.candidate.email
            candidate = instance.candidate.username
            blueprint = instance.blueprint.name
            email_context = {
                'username': candidate.capitalize(),
                'blueprint': blueprint
            }
            html_email_context = render_to_string('email_templates/unapplied_from_blueprint.html', email_context)
            self.perform_destroy(instance)
            send_mail(subject='Unapplied from Job',
                      message='',
                      from_email='alek.rajic@icruits.com',
                      recipient_list=[str(addr,), ],
                      html_message=html_email_context)

        except Http404:
            pass

        return response.Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            try:
                has_failed = request.data['has_failed']
                instance.has_failed = has_failed
            except:
                has_failed = False
                instance.has_failed = has_failed

            try:
                has_completed_simulation = request.data['has_completed']
                instance.has_completed_simulation = has_completed_simulation
            except:
                has_completed_simulation = True
                instance.has_completed_simulation = has_completed_simulation

            try:
                simulator_results = request.data['results']
                instance.simulator_results = simulator_results
            except:
                pass

            try:
                times_tried = request.data['times_tried']
                instance.times_tried = times_tried
            except:
                instance.times_tried = 0

            try:
                times_failed = request.data['times_failed']
                instance.times_failed = times_failed
            except:
                instance.times_failed = 0

            try:
                tasks_completed = request.data['tasks_completed']
                instance.tasks_completed = tasks_completed
            except:
                instance.tasks_completed = 0

            instance.save()

            if has_completed_simulation and not has_failed:
                que_obj = Queue.objects.filter(blueprint=instance.blueprint.id).first()
                user_obj = user.objects.filter(id=instance.candidate.id).first()
                last_position = que_obj.stack.last().candidate_position
                last_position += 1
                new_stack = QueueStack(candidate=user_obj,
                                       candidate_position=last_position,
                                       has_applied=False,
                                       has_icruited=True)
                new_stack.save()

                que_obj.stack.add(new_stack)

        except Http404:
            pass

        return response.Response(status=status.HTTP_201_CREATED)


class ReviewResultsViewSet(views.APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request, format=None):
        try:
            blueprint_id = request.data['blueprint']
            user_id = request.data['user']
        except:
            return response.Response(status=status.HTTP_404_NOT_FOUND)

        user_obj = user.objects.filter(id=user_id).first()
        blueprint_obj = Blueprint.objects.filter(id=blueprint_id).first()
        send_to = user_obj.email
        email_html_context = {
            'username': user_obj.username,
            'blueprint': blueprint_obj.name,
            'company': blueprint_obj.company_name
        }
        email_html = render_to_string('email_templates/reviewing_results.html', email_html_context)
        send_mail(subject='Reviewing Your Simulation Results',
                  message='',
                  from_email='alek.rajic@icruits.com',
                  recipient_list=[send_to, ],
                  html_message=email_html)

        return response.Response(status=status.HTTP_200_OK)


class PrehiredEmployeeViewSet(viewsets.ModelViewSet):
    queryset = PrehiredEmployee.objects.all()
    serializer_class = PrehiredEmployeeSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def create(self, request, *args, **kwargs):
        que_stack = request.data['que_stack']
        user_id = request.data['user_id']
        blueprint_id = request.data['blueprint_id']

        stack_obj = QueueStack.objects.filter(id=que_stack).first()
        candidate = stack_obj.candidate.id

        user_obj = user.objects.filter(id=candidate).first()
        blueprint_obj = Blueprint.objects.filter(id=blueprint_id).first()

        serializer = PrehiredEmployeeSerializer(data={'blueprint': blueprint_id,
                                                      'employee': candidate})

        if serializer.is_valid():
            stack_obj.has_interview = True
            stack_obj.has_icruited = False
            stack_obj.has_applied = False
            stack_obj.save()
            self.perform_create(serializer)
            email_html_context = {
                'company': blueprint_obj.company_name,
                'blueprint': blueprint_obj.name,
                'username': user_obj.username
            }
            email_html = render_to_string('email_templates/accept_interview.html', email_html_context)
            send_mail(subject='Incoming Interview',
                      message='',
                      from_email='alek.rajic@icruits.com',
                      recipient_list=[user_obj.email, ],
                      html_message=email_html)
        return response.Response(status=status.HTTP_201_CREATED)


class BlueprintsCandidateHasAppliedViewSet(views.APIView):
    permission_classes = [
        permissions.AllowAny,
    ]
    parser_classes = [
        parsers.JSONParser,
    ]
    renderer_classes = [
        renderers.JSONRenderer,
    ]

    def post(self, request, format=None):
        data = json.loads(request.body)

        user_obj = user.objects.filter(email=data.get('username')).first()

        response_data = AppliedBlueprints.objects.filter(candidate=user_obj.id)

        send_data = serialize.serialize('json', response_data)
        return response.Response(data=send_data, status=status.HTTP_200_OK)


class HiredEmployeeViewSet(viewsets.ModelViewSet):
    queryset = HiredEmployee.objects.all()
    serializer_class = HiredEmployeeSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]


def RobotsView(request):

    response_text = ""
    http_host = request.get_host()

    if http_host:
        response_text = "User-agent: *\nDisallow: /"

    return HttpResponse(response_text, content_type="text/plain")
