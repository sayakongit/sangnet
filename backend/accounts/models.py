from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from .manager import UserManager

APPLICATION_STATUS_CHOICES = (
    ("NA", "Not Applied"),
    ("AP", "Applied"),
    ("VR", "Verified"),
    ("RJ", "Rejected"),
)


#  Custom User Model
class User(AbstractBaseUser, PermissionsMixin):
    username = None
    email = models.EmailField(
        max_length=30,
        unique=True,
    )

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=10, unique=True, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_donor = models.BooleanField(default=False)
    donor_id = models.IntegerField(null=True, blank=True)
    adhaar_number = models.CharField(max_length=12, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    otp = models.CharField(max_length=4, null=True, blank=True)
    coordinates = models.OneToOneField('Coordinate', on_delete=models.SET_NULL, null=True, blank=True)
    donor_application_status = models.CharField(max_length=30, choices=APPLICATION_STATUS_CHOICES, default="NA")

    objects = UserManager()
    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email


class Coordinate(models.Model):
    latitude = models.CharField(max_length=100)
    longitude = models.CharField(max_length=100)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.latitude} {self.longitude}"
