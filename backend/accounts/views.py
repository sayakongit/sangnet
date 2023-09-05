import logging
from django.shortcuts import render
from .models import User, Coordinate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from rest_framework import status
from .serializers import *
from django.contrib.auth import authenticate
from .emails import send_verification_email

logger = logging.getLogger('accounts.views')


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# Create your views here
class RegisterView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        confirm_password = request.data['confirm_password']
        adhaar_number = request.data['adhaar_number']
        phone = request.data['phone']
        address = request.data['address']
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        date_of_birth = request.data['date_of_birth']

        if password != confirm_password:
            return Response({'message': 'passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email)
        if user.exists():
            return Response({'message': 'email already exits'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User(email=email, adhaar_number=adhaar_number, phone=phone, address=address, first_name=first_name,
                        last_name=last_name, date_of_birth=date_of_birth)
            user.set_password(password)
            user.save()
        except IntegrityError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        send_verification_email(email=email)
        response = {
            'status': 'user registered successfully',
            'user_id': user.id
            # 'refresh': str(refresh),
            # 'access': str(refresh.access_token)
        }
        return Response(response, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    #   renderer_classes = [UserRenderer]
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            token = get_tokens_for_user(user)
            data = {
                "user_id": user.id,
                "is_verified": user.is_verified
            }

            if not user.is_verified:
                return Response(
                    {'message': 'logged in successfully', 'data': data}, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'message': 'logged in successfully', 'data': data, 'token': token}, status=status.HTTP_200_OK)

        else:
            logger.info(f"Login with invalid credentials by email '{email}'")
            return Response({'message': 'invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTP(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = VerifyOtpSerializer(data=data)

            if serializer.is_valid():
                email = serializer.data['email']
                otp = serializer.data['otp']

                user = User.objects.filter(email=email)
                if not user.exists():
                    return Response({'message': 'user does not exist'}, status=status.HTTP_400_BAD_REQUEST)

                user = user.first()

                if user.is_verified:
                    return Response({'message': 'user already verified'}, status=status.HTTP_400_BAD_REQUEST)

                if user.otp != otp:
                    return Response({'message': 'incorrect OTP! try again'}, status=status.HTTP_400_BAD_REQUEST)

                user.is_verified = True
                user.save()

                return Response({'message': 'otp verified successfully'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'otp verification failed'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'message': 'something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class UpdateCoordinates(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = UpdateCoordinatesSerializer(data=data)

            if serializer.is_valid():
                email = serializer.data['email']
                latitude = serializer.data['latitude']
                longitude = serializer.data['longitude']

                user = User.objects.filter(email=email)

                if not user.exists():
                    return Response({'message': 'user does not exist'}, status=status.HTTP_400_BAD_REQUEST)

                user = user.first()

                location = user.coordinates

                if location is None:
                    coordinates = Coordinate.objects.create(latitude=latitude, longitude=longitude)
                    coordinates.save()
                    user.coordinates = coordinates
                else:
                    location.latitude = latitude
                    location.longitude = longitude
                    location.save()

                user.save()

                return Response({'message': 'location updated successfully'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'enter all the fields'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print('Error -->', str(e))
            return Response({'message': 'something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    # permission_classes = (IsAuthenticated,)
    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'message': 'user does not exist'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileViewSerializer(user)
        # serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserProfileViewSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'profile updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
