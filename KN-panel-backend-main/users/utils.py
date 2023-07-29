from rest_framework.permissions import exceptions
import requests

def check_marzban_user_paramters(request):
    """ Check the Required Marzban Parameters Send To View Or Not """
    parameters = ["username", "expire", "data_limit", "data_limit_reset_strategy"]
    main_data={}
    for s in parameters:
        get_parameter = request.POST.get("s")
        if get_parameter is None:
            raise exceptions.PermissionDenied(f"{s} should set in body")
        
