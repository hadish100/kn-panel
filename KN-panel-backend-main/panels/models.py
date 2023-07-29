""" Create The Models Relation to Panels """
from django.db import models
from django_countries.fields import CountryField
import uuid
from django import forms
from .utils import *


class Panel(models.Model):
    """ The Panel Model For Database """
    panel_name = models.CharField(max_length=2000, unique=True)
    panel_url = models.URLField(max_length=5000, unique=True)
    panel_base_url = models.URLField(max_length=5000, null=True, blank=True, unique=True)
    panel_username = models.CharField(max_length=1000)
    panel_password = models.CharField(max_length=2000)
    panel_country = CountryField()
    country = models.CharField(max_length=200, null=True, editable=False)
    panel_user_max_count = models.IntegerField()
    panel_user_max_date = models.IntegerField()
    panel_traffic = models.IntegerField()
    panel_disable = models.BooleanField(default=False)
    panel_user_token = models.CharField(max_length=2000, editable=False, null=True, blank=True)

    def __str__(self):
        return f"The {self.panel_name} panel from {self.panel_country} Country"

    def save(self, *args, **kwargs):
        """ Set The countries unique """
        latest_panel = Panel.objects.filter(panel_country=self.panel_country).count()
        print(latest_panel)
        if latest_panel > 0:
            number = latest_panel + 1 - 1
        else:
            number = 1
        self.country = f"{self.panel_country}{number}"
        super().save(*args, **kwargs)
