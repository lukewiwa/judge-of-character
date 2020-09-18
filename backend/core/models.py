import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class UuidMixin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class User(AbstractUser, UuidMixin):
    pass


class Stat(UuidMixin):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="stats")
    level = models.IntegerField()
    points = models.IntegerField()
