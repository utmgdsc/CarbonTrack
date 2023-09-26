# Python Imports
import base64
from io import BytesIO

import flask
from flask import Blueprint, Response, jsonify, request

# uncomment if you want to populate the db everytime the backend starts
# from routes.cockroach.populate import populate
# populate()


users = Blueprint('/users', __name__)


@users.route("/get_user", methods=['POST'])
def get_treatment(user_id: str) -> Response:
    pass
