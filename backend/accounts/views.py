import requests
from django.shortcuts import render
from .models import User, Coordinate
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
import json
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from rest_framework import status
from .serializers import (
    UserLoginSerializer,
    VerifyOtpSerializer,
    UpdateCoordinatesSerializer,
    UserProfileViewSerializer,
)
from django.contrib.auth import authenticate
from .emails import send_verification_email
from authlib.integrations.django_client import OAuth
from django.conf import settings
from django.shortcuts import redirect, render
from django.urls import reverse
from urllib.parse import quote_plus, urlencode


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# Create your views here
class RegisterView(APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]
        confirm_password = request.data["confirm_password"]
        adhaar_number = request.data["adhaar_number"]
        phone = request.data["phone"]
        address = request.data["address"]
        first_name = request.data["first_name"]
        last_name = request.data["last_name"]
        date_of_birth = request.data["date_of_birth"]

        if password != confirm_password:
            return Response(
                {"message": "passwords do not match"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email=email)
        if user.exists():
            return Response(
                {"message": "email already exits"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User(
                email=email,
                adhaar_number=adhaar_number,
                phone=phone,
                address=address,
                first_name=first_name,
                last_name=last_name,
                date_of_birth=date_of_birth,
            )
            user.set_password(password)
            user.save()
        except IntegrityError as e:
            print("Error -->", str(e))
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        send_verification_email(email=email)
        response = {
            "status": "user registered successfully",
            "user_id": user.id
            # 'refresh': str(refresh),
            # 'access': str(refresh.access_token)
        }
        return Response(response, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    #   renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get("email")
        password = serializer.data.get("password")
        user = authenticate(email=email, password=password)
        if user is not None:
            token = get_tokens_for_user(user)
            data = {"user_id": user.id, "is_verified": user.is_verified}

            if not user.is_verified:
                return Response(
                    {"message": "logged in successfully", "data": data},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "logged in successfully", "data": data, "token": token},
                    status=status.HTTP_200_OK,
                )

        else:
            return Response(
                {"message": "invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )


class VerifyOTP(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = VerifyOtpSerializer(data=data)

            if serializer.is_valid():
                email = serializer.data["email"]
                otp = serializer.data["otp"]

                user = User.objects.filter(email=email)
                if not user.exists():
                    return Response(
                        {"message": "user does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                user = user.first()

                if user.is_verified:
                    return Response(
                        {"message": "user already verified"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if user.otp != otp:
                    return Response(
                        {"message": "incorrect OTP! try again"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                user.is_verified = True
                user.save()

                return Response(
                    {"message": "otp verified successfully"}, status=status.HTTP_200_OK
                )

            else:
                return Response(
                    {"message": "otp verification failed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            print("Error -->", str(e))
            return Response(
                {"message": "something went wrong"}, status=status.HTTP_400_BAD_REQUEST
            )


class UpdateCoordinates(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = UpdateCoordinatesSerializer(data=data)

            if serializer.is_valid():
                email = serializer.data["email"]
                latitude = serializer.data["latitude"]
                longitude = serializer.data["longitude"]

                user = User.objects.filter(email=email)

                if not user.exists():
                    return Response(
                        {"message": "user does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                user = user.first()

                location = user.coordinates

                if location is None:
                    coordinates = Coordinate.objects.create(
                        latitude=latitude, longitude=longitude
                    )
                    coordinates.save()
                    user.coordinates = coordinates
                else:
                    location.latitude = latitude
                    location.longitude = longitude
                    location.save()

                user.save()

                return Response(
                    {"message": "location updated successfully"},
                    status=status.HTTP_200_OK,
                )

            else:
                return Response(
                    {"message": "enter all the fields"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            print("Error -->", str(e))
            return Response(
                {"message": "something went wrong"}, status=status.HTTP_400_BAD_REQUEST
            )


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "logged out successfully"},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    # permission_classes = (IsAuthenticated,)
    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response(
                {"message": "user does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserProfileViewSerializer(user)
        # serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserProfileViewSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "profile updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


oauth = OAuth()

oauth.register(
    "auth0",
    client_id=settings.AUTH0_CLIENT_ID,
    client_secret=settings.AUTH0_CLIENT_SECRET,
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f"https://{settings.AUTH0_DOMAIN}/.well-known/openid-configuration",
)


def login(request):
    response = oauth.auth0.authorize_redirect(
        request, request.build_absolute_uri(reverse("callback"))
    )
    print(response.url)
    return JsonResponse({"URL": response.url})


def callback(request):
    token = oauth.auth0.authorize_access_token(request)
    request.session["user"] = token
    return redirect(request.build_absolute_uri(reverse("index")))


def logout(request):
    request.session.clear()

    return redirect(
        f"https://{settings.AUTH0_DOMAIN}/v2/logout?"
        + urlencode(
            {
                "returnTo": request.build_absolute_uri(reverse("index")),
                "client_id": settings.AUTH0_CLIENT_ID,
            },
            quote_via=quote_plus,
        ),
    )


def index(request):
    user = request.session.get("user")
    access_token = user["access_token"]
    user_id = user["userinfo"]["sub"].replace("|", "%7C")

    url = f"https://dev-4xds7qadrrlfysb2.us.auth0.com/api/v2/users/{user_id}"

    payload = {}
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNTbE9RdzA3R0JYbjNfOEM1TVdMNCJ9.eyJpc3MiOiJodHRwczovL2Rldi00eGRzN3FhZHJybGZ5c2IyLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiIxMU9CS1VjTzdsMkExQWU1TzVqUHRzaXMzWmRLQW1rMkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtNHhkczdxYWRycmxmeXNiMi51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTY5MTY5OTUyMiwiZXhwIjoxNjkxNzg1OTIyLCJhenAiOiIxMU9CS1VjTzdsMkExQWU1TzVqUHRzaXMzWmRLQW1rMiIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmFjdGlvbnMgdXBkYXRlOmFjdGlvbnMgZGVsZXRlOmFjdGlvbnMgY3JlYXRlOmFjdGlvbnMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDppbnNpZ2h0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMgcmVhZDplbnRpdGxlbWVudHMgcmVhZDphdHRhY2tfcHJvdGVjdGlvbiB1cGRhdGU6YXR0YWNrX3Byb3RlY3Rpb24gcmVhZDpvcmdhbml6YXRpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVycyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVycyBjcmVhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgY3JlYXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uc19zdW1tYXJ5IGNyZWF0ZTphY3Rpb25zX2xvZ19zZXNzaW9ucyBjcmVhdGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyByZWFkOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgdXBkYXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgZGVsZXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgcmVhZDpjbGllbnRfY3JlZGVudGlhbHMgY3JlYXRlOmNsaWVudF9jcmVkZW50aWFscyB1cGRhdGU6Y2xpZW50X2NyZWRlbnRpYWxzIGRlbGV0ZTpjbGllbnRfY3JlZGVudGlhbHMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.UE1nuXLClmgcFr3CGBlnVd1amSr10CpD9ClV5M9GlovI2BwkQBkZrZii1sdSA9sUghcrDnlhRuQF4wmydEv8gdkmeGNAMbAlk6nMnZY2Puepe9Fdngljl35fv0yKUGt1XKhtASVUjSs2Ek1-ydeoWaCSQ5L2DVFUpPNIv-d7CphJugYIZEIk0AbDlgd5RVVPL8VkRdR4onPKrwfsQJRK7XCQfWKLzXkEK1yIn04RBwcU1oPxRIopjP-kG8njNNTJwVYX5PBcugyicKLNeRk_XtieJvXkleoyTVVLnvEzkulW_B-dsyC4yA0pzEpqbvvyhr_3qwFHWEeMaDegh3iqSw",
    }
    response = requests.request("GET", url, headers=headers, data=payload)
    response = response.json()

    return JsonResponse(
        {"context": {"session": request.session.get("user"), "user_data": response}},
    )
