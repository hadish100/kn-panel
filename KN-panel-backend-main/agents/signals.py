# Import Required packages for create signals
from django.db.models.signals import post_save, pre_save
from agents.models import Agent
from django.contrib.auth.models import User
import datetime
from django_celery_beat.models import PeriodicTask, CrontabSchedule
import json


def create_agent(sender, created, instance, **kwargs):
    """ Create Agent After the user created! """
    if created:
        agent = instance
        # Set The expire datetime
        now = datetime.datetime.now()
        later = now + datetime.timedelta(days=agent.maximum_day)
        agent.expire_date = later
        agent.save()
        """ Set the schedule task and separate the countries by adding a number """
        schedule, create = CrontabSchedule.objects.get_or_create(month_of_year=agent.expire_date.month,
                                                                 day_of_month=agent.expire_date.day,
                                                                 hour=agent.expire_date.hour,
                                                                 minute=agent.expire_date.minute)

        task = PeriodicTask.objects.create(crontab=schedule,
                                           name=f"disable_agent_{agent.id}_after_{agent.maximum_day}_day",
                                           task="agents.tasks.disable_agent",
                                           kwargs=json.dumps({"agent_id": str(agent.id)}))


post_save.connect(create_agent, Agent)


def edit_country(sender, created, instance, **kwargs):
    """ separate the agents with countries """

    if created:
        agent = instance
        latest_panel = Agent.objects.filter(country=agent.country).count()
        if latest_panel > 1:
            number = latest_panel + 1 - 1
        else:
            number = 1
        agent.agent_country = f"{agent.country}{number}"
        agent.save()


post_save.connect(edit_country, Agent)


def edit_agent(sender, created, instance, **kwargs):
    """ Edit Expire date Of Agent """
    agent = instance
    if not agent.pk:
        # New object, set defaults
        now = datetime.datetime.now()
        later = now + datetime.timedelta(days=agent.maximum_day)
        agent.expire_date = later
        schedule, create = CrontabSchedule.objects.get_or_create(month_of_year=agent.expire_date.month,
                                                                 day_of_month=agent.expire_date.day,
                                                                 hour=agent.expire_date.hour,
                                                                 minute=agent.expire_date.minute)

        try:
            task = PeriodicTask.objects.get(crontab=schedule,
                                            name=f"disable_agent_{agent.id}_after_{agent.maximum_day}_day",
                                            task="agents.tasks.disable_agent",
                                            kwargs=json.dumps({"agent_id": agent.id}))
            task.delete()
        except:
            pass
        task = PeriodicTask.objects.create(crontab=schedule,
                                           name=f"disable_agent_{agent.id}_after_{agent.maximum_day}_day",
                                           task="agents.tasks.disable_agent", kwargs=json.dumps({"agent_id": agent.id}))
    else:
        # Existing object, update with new values
        now = datetime.datetime.now()
        later = now + datetime.timedelta(days=agent.maximum_day)
        agent.expire_date = later

        # You can add any additional checks or changes to the object here

        agent.__class__.objects.filter(pk=agent.pk).update(expire_date=agent.expire_date)


post_save.connect(edit_agent, Agent)
