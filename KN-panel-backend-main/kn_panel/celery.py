from __future__ import unicode_literals, absolute_import
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "kn_panel.settings")

app = Celery("kn_panel")

app.conf.enable_utc = False

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()



@app.task(bind=True)
def debug_task(self):
    print(f"Request : {self.request!r}")
