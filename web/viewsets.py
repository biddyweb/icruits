from web.models import (
    JobFeed,
    Help,
)
from web.serializers import (
    JobFeedSerializer,
    HelpSerializer,
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


class JobFeedViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobFeed.objects.all()
    serializer_class = JobFeedSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    lookup_field = 'job_name_slug'


class QueueViewSet(views.APIView):
    queryset = JobFeed.objects.all()
    renderer_classes = [
        renderers.JSONRenderer,
    ]
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        queues = JobFeed.objects.all()
        job_queue = request.query_params.get('queue')
        if job_queue:
            queues = queues.filter(queue=job_queue)
        content = {'job_queue': queues}
        # za django 1.10 koristiti json dumps
        return response.Response(json.dumps(content), content_type='application/json; charset=utf-8')
        #return response.Response(content, content_type='application/json; charset=utf-8')


class HelpViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Help.objects.all()
    serializer_class = HelpSerializer
    permission_classes = [
        permissions.AllowAny,
    ]


class LogoutViewSet(views.APIView):
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
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def get_object(self, *args, **kwargs):
        return self.request.user


class CheckUserViewSet(views.APIView):
    """
    Use this endpoint to check user.
    """
    permission_classes = (
        permissions.AllowAny,
    )

    def post(self, request, format=None):
        try:
            data = request.body
        except Exception as e:
            pass

        checkUser = User.objects.filter(username=data)

        if checkUser:
            return response.Response(status=status.HTTP_200_OK)
        else:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)
