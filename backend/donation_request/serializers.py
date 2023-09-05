from rest_framework import serializers
from .models import *
from donor.serializers import *
from donor.models import *


class DonationRequestSerializer(serializers.ModelSerializer):
    donor_id = DonorProfileViewSerializer()
    requested_by = UserProfileViewSerializer()

    class Meta:
        model = DonationRequest
        fields = "__all__"
