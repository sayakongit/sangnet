from django.db import models
from accounts.models import *
from donor.models import *
import uuid

DONATION_CHOICES = (
    ('blood', 'BLOOD'),
    ('plasma', 'PLASMA')
)
CURRENT_STATUS_CHOICES = (
    ('active', 'ACTIVE'),
    ('pending', 'PENDING'),
    ('fullfilled', 'FULLFILLED'),
    ('cancelled', 'CANCELLED')
)


# Create your models here.
class DonationRequest(models.Model):
    request_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    requested_by = models.ForeignKey("accounts.User", on_delete=models.PROTECT)
    phone_number = models.CharField(max_length=10)
    blood_group = models.CharField(max_length=10)
    required_on = models.DateTimeField()
    place_of_donation = models.CharField(max_length=50)
    units_required = models.IntegerField()
    reason = models.CharField(max_length=250, blank=True, null=True)
    type_of_donation = models.CharField(max_length=7, choices=DONATION_CHOICES, default='blood')
    is_urgent = models.BooleanField(default=False)
    coordinates = models.ForeignKey("accounts.Coordinate", on_delete=models.PROTECT, null=True, blank=True)
    reciever_approved = models.BooleanField(default=False)
    donor_approved = models.BooleanField(default=False)
    current_status = models.CharField(max_length=20, choices=CURRENT_STATUS_CHOICES, default="pending")
    donor_id = models.ForeignKey('donor.Donor', on_delete=models.PROTECT, null=True, blank=True)

    def __str__(self):
        return f'{self.request_id}-{self.requested_by.first_name} {self.requested_by.last_name} - {self.blood_group}'
