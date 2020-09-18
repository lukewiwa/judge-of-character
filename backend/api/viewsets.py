from django.contrib.auth import get_user_model
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Stat

from .pagination import StandardResultsSetPagination
from .serializers import UserDetailSerializer, UserSerializer, LeaderboardSerializer

User = get_user_model()


class UserViewSet(viewsets.ReadOnlyModelViewSet, mixins.UpdateModelMixin):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    pagination_class = StandardResultsSetPagination

    @action(detail=False, methods=["get"], serializer_class=UserDetailSerializer)
    def current(self, request, pk=None):
        user = request.user
        if user.is_authenticated:
            serializer_class = self.get_serializer_class()
            serializer = serializer_class(user, context={"request": request})
            return Response(serializer.data)
        return Response({})


class LeaderboardViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Stat.objects.order_by("points").select_related("user")
    serializer_class = LeaderboardSerializer
    pagination_class = StandardResultsSetPagination
