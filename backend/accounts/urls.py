from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from .views import *

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', RegisterView.as_view()),
    path('login/', UserLoginView.as_view()),
    path('verify/', VerifyOTP.as_view()),
    path('location/', UpdateCoordinates.as_view()),
    path('logout/', LogoutView.as_view()),
    path('profile/<int:pk>/', UserProfileView.as_view()),
]
