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

    def __str__(self) -> str:
        return f"{self.user.username}:{self.points}"


class Leader(Stat):
    class Meta:
        proxy = True
