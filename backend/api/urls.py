from django.conf import settings
from django.urls import include, path

from rest_framework import routers

from .viewsets import UserViewSet, LeaderViewset, StatViewset

API_VERSION = 1

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"leaderboard", LeaderViewset, basename="leader")
router.register(r"stats", StatViewset)


urlpatterns = [
    path(
        f"v{API_VERSION}/",
        include(
            [
                path("", include(router.urls)),
            ]
        ),
    ),
]

if settings.DEBUG:
    urlpatterns += [path(f"v{API_VERSION}/auth/", include("rest_framework.urls"))]
