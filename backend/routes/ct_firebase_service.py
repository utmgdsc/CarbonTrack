# Python Imports
from flask import Blueprint, render_template


ct_firebase_service = Blueprint('/f', __name__)


# This is just for testing
@ct_firebase_service.route("/google")
def test_login_with_google() -> str:
    return render_template('google_login.html')


