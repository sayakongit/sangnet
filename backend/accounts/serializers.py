from rest_framework import serializers
from .models import User, Coordinate


class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=30)

    class Meta:
        model = User
        fields = ['email', 'password']


class VerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=30)
    otp = serializers.CharField(max_length=4)


class UpdateCoordinatesSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=30)
    latitude = serializers.CharField(max_length=100)
    longitude = serializers.CharField(max_length=100)


class CoordinateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coordinate
        exclude = ('id',)


class UserProfileViewSerializer(serializers.ModelSerializer):
    coordinates = CoordinateSerializer()

    class Meta:
        model = User
        exclude = (
            'password', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions', 'otp', 'last_login')
