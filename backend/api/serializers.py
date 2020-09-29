from django.contrib.auth import get_user_model
from rest_framework import serializers

from core.models import Stat, Leader

User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "url")
        read_only_fields = ("username", "id")


class UserDetailSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "groups", "is_staff", "url")


class LeaderSerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.CharField(read_only=True, source="user.username")

    class Meta:
        model = Leader
        fields = ("points", "level", "username", "url")


class StatSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=None)

    class Meta:
        model = Stat
        fields = ("points", "level", "url", "user")
