from flask_httpauth import HTTPTokenAuth
from utils.FirebaseAPI import FirebaseAPI

auth = HTTPTokenAuth(scheme='Bearer')


@auth.verify_token
def verify_token(token: str) -> bool:
    dev = True
    if dev:
        return dev
    d = FirebaseAPI.verify_google_token(token)
    print(f"USER AUTHENTICATED: {bool(d)}")
    return bool(d)


@auth.error_handler
def unauthorized() -> tuple[str, int]:
    return "Unauthorized access", 401
