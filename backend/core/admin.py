from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import Stat

User = get_user_model()


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    pass


@admin.register(Stat)
class StatAdmin(admin.ModelAdmin):
    list_select_related = ("user",)
