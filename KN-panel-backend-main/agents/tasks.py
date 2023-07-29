""" Write our celery task here """
from celery import shared_task
from .models import Agent
import os


@shared_task
def disable_agent(agent_id):
    """ Disable The agents """
    get_agent = Agent.objects.filter(id=agent_id).first()
    if get_agent is None:
        return "Agent Not found!"

    get_agent.disable = True
    get_agent.save()
    return "Done!"