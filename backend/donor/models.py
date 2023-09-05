from django.db import models
from accounts.models import User
from donation_request.models import DonationRequest


# Create your models here.
class Donor(models.Model):
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE)
    donor_since = models.DateField(auto_now_add=True)
    blood_group = models.CharField(max_length=10)
    last_donated_on = models.DateField(null=True, blank=True)
    is_available = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    level = models.FloatField(default=1.0)
    donation_count = models.IntegerField(default=0)
    donation_required_to_reach_next_level = models.IntegerField(default=0)
    active_donation_request = models.ForeignKey('donation_request.DonationRequest', on_delete=models.SET_NULL,
                                                null=True, blank=True)

    def __str__(self):
        return f"{self.id} - {self.user.first_name} {self.user.last_name}"
