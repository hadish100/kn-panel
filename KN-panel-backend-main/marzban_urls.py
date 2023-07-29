MARZBAN_BASE_URL = "http://127.0.0.1:8000"

# Marzban Admin Section
LOGIN_ACCESS_TOKEN = f"/api/admin/token"  # Method --> POST Request
GET_CURRENT_ADMIN = f"/api/admin"  # Method --> GET Request
CREATE_ADMIN = f"/api/admin"  # Method --> POST Request
MODIFY_ADMIN = f"/api/admin/"  # + {username} | Method --> PUT
REMOVE_ADMIN = f"/api/admin/"  # + {username} | Method --> DELETE
GET_ADMINS = f"/api/admins"  # Method --> GET

# Marzban User Section
ADD_USER = f"/api/user"  # Method --> POST
GET_USER = f"/api/user/"  # + {username} --> GET
PUT_USER = f"/api/user/"  # + {username} --> PUT
DELETE_USER = f"/api/user/"  # + {username} --> DELETE
RESET_USER_DATA = f"/api/user/"  # + {username}/reset --> DELETE
GET_USERS = f"/api/users"

STATUS_CODE_FOR_MARZBAN = [200, 201, 203, 204]
