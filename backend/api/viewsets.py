from django.contrib.auth import get_user_model
from django.db.models.expressions import Subquery
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Stat, Leader

from .pagination import StandardResultsSetPagination
from .serializers import (
    UserDetailSerializer,
    UserSerializer,
    LeaderSerializer,
    StatSerializer,
)

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
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(user, context={"request": request})
        return Response(serializer.data)


class LeaderViewset(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Leader.objects.filter(
            pk__in=Subquery(
                Leader.objects.order_by("user", "-points")
                .select_related("user")
                .distinct("user")
                .values("id")
            )
        )
        .order_by("-points")
        .select_related("user")
    )

    serializer_class = LeaderSerializer
    pagination_class = StandardResultsSetPagination


class StatViewset(viewsets.ModelViewSet):
    queryset = Stat.objects.all().select_related("user")
    serializer_class = StatSerializer

    def perform_create(self, serializer) -> None:
        serializer.save(user=self.request.user)
