from rest_framework import serializers
from .models import *
from accounts.serializers import *
from datetime import datetime,timedelta,date


class ApplyAsDonorSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=True)
    blood_group = serializers.CharField(max_length=5, required=True)
    last_donated_on = serializers.DateField(required=False)

    def validate_last_donated_on(self, value):
        # Check if last donation date is within the last 3 months
        if value:
            today = date.today()
            three_months_ago = today - timedelta(days=90)
            if value > three_months_ago:
                raise serializers.ValidationError("Donor cannot donate within the last 3 months.")
        return value


class DonorProfileViewSerializer(serializers.ModelSerializer):
    user = UserProfileViewSerializer()

    class Meta:
        model = Donor
        fields = '__all__'
