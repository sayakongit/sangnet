from django.core.mail import send_mail
from django.conf import settings
import random
from .models import User
import logging

logger = logging.getLogger('donation_request.emails')


def send_email_create(email):
    try:
        user_obj = User.objects.get(email=email)
        subject = 'Donation Request Submitted'
        message = f'Hi {user_obj.first_name},\nYou have successfully submitted the donation request'
        email_from = settings.EMAIL_HOST_USER
        send_mail(subject, message, email_from, [email])
    except Exception as e:
        logging.error(f"Unable to send request submission mail to {user_obj.first_name} {user_obj.last_name}", exc_info=True)


def send_fullfilled_email(donor_email, receiver_email):
    try:
        donor = User.objects.get(email=donor_email)
        receiver = User.objects.get(email=receiver_email)

        subject = 'Request Fullfilled'

        donor_message = f'Hi {donor.first_name},\nThank you for your valuable donation!.'
        receiver_message = f'Hi {receiver.first_name},\nYour Donation Status is fullfilled.'
        email_from = settings.EMAIL_HOST_USER
        send_mail(subject, donor_message, email_from, [donor_email])
        send_mail(subject, receiver_message, email_from, [receiver_email])
    except Exception as e:
        logging.error(f"Unable to send request fulfillment mail to {donor.first_name} {donor.last_name}(Donor) and {receiver.first_name} {receiver.last_name}(Receiver)", exc_info=True)


def send_accepted_email(donor_email, receiver_email):
    try:
        donor = User.objects.get(email=donor_email)
        receiver = User.objects.get(email=receiver_email)

        subject = 'Request Accepted'

        receiver_message = f'Hi {receiver.first_name},\nYour Donation Request is accepted by {donor.first_name}.'
        donor_message = f'Hi {donor.first_name},\nYou have accepted the donation request of {receiver.first_name}.'

        email_from = settings.EMAIL_HOST_USER
        send_mail(subject, donor_message, email_from, [donor_email])
        send_mail(subject, receiver_message, email_from, [receiver_email])
    except Exception as e:
        logging.error(f"Unable to send request acceptance mail to {donor.first_name} {donor.last_name}(Donor) and {receiver.first_name} {receiver.last_name}(Receiver)", exc_info=True)
