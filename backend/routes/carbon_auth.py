from flask_httpauth import HTTPTokenAuth
from utils.FirebaseAPI import FirebaseAPI
from flask import g

auth = HTTPTokenAuth(scheme="Bearer")


@auth.verify_token
def verify_token(token: str) -> bool:
    user_info = FirebaseAPI.verify_google_token(token)

    print(f"USER AUTHENTICATED: {bool(user_info)}")

    if user_info:
        g.current_user = user_info  # Setting the current user in Flask's global object
        return True
    else:
        return False


@auth.error_handler
def unauthorized() -> tuple[str, int]:
    return "Unauthorized access", 401
