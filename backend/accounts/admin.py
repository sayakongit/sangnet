from django.contrib import admin
from .models import User, Coordinate


class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name", "email")


admin.site.register(User, UserAdmin)
admin.site.register(Coordinate)
