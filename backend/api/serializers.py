from django.contrib.auth import get_user_model
from rest_framework import serializers

from core.models import Stat

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")
        read_only_fields = ("username",)


class UserDetailSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "groups", "is_staff")


class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stat
        fields = ("points", "level", "user__username")
