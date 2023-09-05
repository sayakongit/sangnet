from django.core.mail import send_mail
from django.conf import settings
import random
from .models import User


def send_verification_email(email):
    user_obj = User.objects.get(email=email)
    subject = 'Verify your account'
    otp = random.randint(1000, 9999)
    message = f'Hi {user_obj.first_name},\nYour OTP is {otp}'
    email_from = settings.EMAIL_HOST_USER
    send_mail(subject, message, email_from, [email])
    user_obj.otp = otp
    user_obj.save()
