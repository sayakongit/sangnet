from django.urls import path
from .views import *

urlpatterns = [
    path('apply/', ApplyAsDonorView.as_view(), name='apply_as_donor'),
    path('profile/', DonorProfileView.as_view(), name='donor_profile'),
    path('profile/<int:pk>', DonorProfileView.as_view(), name='update_donor_profile'),
    path('nearby/<int:pk>', NearbyDonorsView.as_view(), name='nearby_donors'),
    path('verify/', VerifyDonorView.as_view(), name='verify_donor'),
]
