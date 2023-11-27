# Python Imports
from bson import ObjectId
from flask import Blueprint, Response, abort, jsonify, render_template, request
from models.user import User
from mongodb_api.carbon_track_db import CarbonTrackDB
from routes import carbon_auth
from utils.FirebaseAPI import FirebaseAPI
from utils.carbon_track_errors import CarbonTrackError

ct_firebase_service = Blueprint('/f', __name__)


# This is just for testing
@ct_firebase_service.route("/google")
def test_login_with_google() -> str:
    return render_template('google_login.html')


