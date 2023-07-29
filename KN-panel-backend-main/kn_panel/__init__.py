from .celery import app as celery_app


# Add the Celery application to the project
__all__ = ("celery_app", )