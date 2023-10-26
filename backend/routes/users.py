# Python Imports
import base64
import json
from io import BytesIO
import pprint

import flask
from bson import ObjectId
from flask import Blueprint, Response, jsonify, request

from models.user import User
from mongodb_api.carbon_track_db import CarbonTrackDB
from bson import json_util


users = Blueprint('/users', __name__)


@users.route("/user/<user_id>", methods=['GET'])
def get_user(user_id: str) -> Response:
    query = {"_id": ObjectId(user_id)}
    item = CarbonTrackDB.users_coll.find_one(query)
    item = User.from_json(item).to_json()
    return jsonify({'user': item})


@users.route("/user", methods=['PUT'])
def create_user() -> Response:
    user = User.from_json(request.get_json()['user']).to_json(for_mongodb=True)
    inserted_id = CarbonTrackDB.users_coll.insert_one(user).inserted_id
    user = User.from_json(CarbonTrackDB.users_coll.find_one({"_id": inserted_id})).to_json()
    print(inserted_id)
    return user

@users.route("/user/<user_id>", methods=['DELETE'])
def delete_user(user_id: str) -> Response:
    query = {"_id": ObjectId(user_id)}
    item = CarbonTrackDB.users_coll.find_one(query)
    item = User.from_json(item).to_json()
    CarbonTrackDB.users_coll.delete_one(query)
    return jsonify({'deleted user': item})


@users.route("user/<user_id>", methods=["PATCH"])
def update_user(user_id: str) -> Response:
    query = {"_id": ObjectId(user_id)}
    user = User.from_json(request.get_json()['user']).to_json(for_mongodb=True)
    item = CarbonTrackDB.users_coll.update_one(query, {'$set': user})
    item = CarbonTrackDB.users_coll.find_one(query)
    item = User.from_json(item).to_json()
    return jsonify({'updated_user': item})


