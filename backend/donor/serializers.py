from rest_framework import serializers
from .models import *
from accounts.serializers import *


class ApplyAsDonorSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=True)
    blood_group = serializers.CharField(max_length=5, required=True)
    last_donated_on = serializers.DateField(required=False)


class DonorProfileViewSerializer(serializers.ModelSerializer):
    user = UserProfileViewSerializer()

    class Meta:
        model = Donor
        fields = '__all__'
