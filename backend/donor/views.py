from .models import Donor
from accounts.models import User, APPLICATION_STATUS_CHOICES
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import ApplyAsDonorSerializer, DonorProfileViewSerializer
import geopy.distance
import logging

logger = logging.getLogger('donor.views')


class ApplyAsDonorView(APIView):
    # permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            data = request.data
            serializer = ApplyAsDonorSerializer(data=data)

            if serializer.is_valid():
                user_id = serializer.data['user_id']
                blood_group = serializer.data['blood_group']
                try:
                    last_donated_on = serializer.data['last_donated_on']
                    # TODO: if last donation is less than 6 months ago, mark as not available for donation
                except:
                    last_donated_on = None

                user = User.objects.get(id=user_id)
                if Donor.objects.filter(user=user).exists():

                    application_status = user.donor_application_status

                    for status_tuple in APPLICATION_STATUS_CHOICES:
                        if status_tuple[0] == application_status:
                            application_status = status_tuple[1]
                            break
                    return Response({'message': 'You have already applied as a donor', 'status': application_status},
                                    status=status.HTTP_400_BAD_REQUEST)

                donor = Donor(user=user, blood_group=blood_group, last_donated_on=last_donated_on)
                user.donor_application_status = 'AP'

                donor.save()
                user.donor_id = donor.pk
                user.save()

                response = {
                    'message': 'Donor application submitted successfully'
                }
                return Response(response, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logging.error("Unable to send donor application", exc_info=True)
            return Response({'message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class DonorProfileView(APIView):
    def get(self, request, pk=None):
        if pk is not None:
            try:
                donor = Donor.objects.get(id=pk)
            except Donor.DoesNotExist:
                return Response({'message': 'Donor does not exist'}, status=status.HTTP_404_NOT_FOUND)

            serializer = DonorProfileViewSerializer(donor)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            donors = Donor.objects.all()
            serializer = DonorProfileViewSerializer(donors, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        donor = Donor.objects.get(pk=pk)
        serializer = DonorProfileViewSerializer(donor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'profile updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyDonorView(APIView):
    def post(self, request):
        try:
            data = request.data
            superuser_id = data['superuser_id']
            user_id = data['user_id']
            superuser = User.objects.get(id=superuser_id)
            if not superuser.is_superuser:
                return Response({'message': 'You are not authorized to verify donors'},
                                status=status.HTTP_401_UNAUTHORIZED)
            donor = Donor.objects.get(user_id=user_id)
            user = User.objects.get(id=user_id)

            if donor.is_verified:
                return Response({'message': 'Donor is already verified'}, status=status.HTTP_400_BAD_REQUEST)

            user.is_donar = True
            user.donor_application_status = 'VR'
            user.save()
            donor.is_verified = True
            donor.save()
            return Response({'message': 'Donor verified successfully'})
        except Donor.DoesNotExist:
            return Response({'message': 'Donor does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logging.error("Unable to verify donor", exc_info=True)
            return Response({'message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class NearbyDonorsView(APIView):
    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
            donors = Donor.objects.filter(is_verified=True).exclude(user=user)

            user_long = float(user.coordinates.longitude)
            user_lat = float(user.coordinates.latitude)

            response = []

            for donor in donors:
                coords_1 = (user_lat, user_long)
                coords_2 = (donor.user.coordinates.latitude, donor.user.coordinates.longitude)

                distance = round(geopy.distance.geodesic(coords_1, coords_2).km, 2)

                if distance <= 5:
                    response.append({
                        'donor_id': donor.id,
                        'name': f'{donor.user.first_name} {donor.user.last_name}',
                        'blood_group': donor.blood_group,
                        'distance': distance,
                        'donation_count': donor.donation_count,
                        'longitude': donor.user.coordinates.longitude,
                        'latitude': donor.user.coordinates.latitude,
                    })

            return Response(response, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logging.error("Unable to fetch nearby donors", exc_info=True)
            return Response({'message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
