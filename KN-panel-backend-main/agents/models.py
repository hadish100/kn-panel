""" Create Our Models """

# Import Required Packages
from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from panels.models import Panel


# Start Create the Agent Model
class Agent(models.Model):
    """ The Agents Model """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    agent_name = models.CharField(max_length=200)
    main_volume = models.IntegerField(null=True)
    user_count = models.IntegerField(default=0)
    maximum_day = models.IntegerField(default=30, null=True, blank=True)
    disable = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=True)
    can_delete = models.BooleanField(default=True)
    can_create = models.BooleanField(default=True)

    def __str__(self):
        return self.agent_name
