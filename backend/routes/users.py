# Python Imports
from bson import ObjectId
from flask import Blueprint, Response, jsonify, request

from models.user import User
from mongodb_api.carbon_track_db import CarbonTrackDB
from routes import carbon_auth

users = Blueprint('/users', __name__)


@carbon_auth.auth.login_required
def get_user_obj(user_id: ObjectId) -> User:
    query = {"_id": user_id}
    item = CarbonTrackDB.users_coll.find_one(query)
    item = User.from_json(item)
    return item

@users.route("/user/<user_id>", methods=['GET'])
@carbon_auth.auth.login_required
def get_user(user_id: str) -> Response:
    query = {"_id": ObjectId(user_id)}
    item = CarbonTrackDB.users_coll.find_one(query)
    item = User.from_json(item).to_json()
    return jsonify({'user': item})


@users.route("/user_email/<user_email>", methods=['GET'])
@carbon_auth.auth.login_required
def get_user_by_email(user_email: str) -> Response:
    query = {"email": user_email}
    item = CarbonTrackDB.users_coll.find_one(query)
    item = User.from_json(item).to_json()
    return jsonify({'user': item})


@users.route("/user", methods=['PUT'])
@carbon_auth.auth.login_required
def create_user() -> Response:
    res: dict = request.get_json()['user']
    user = User.from_json(res)

    query = {"email": user.email.lower()}
    item = CarbonTrackDB.users_coll.find_one(query)
    if item is None:
        user = user.to_json()
        inserted_id = CarbonTrackDB.users_coll.insert_one(user).inserted_id
        user = User.from_json(CarbonTrackDB.users_coll.find_one({"_id": inserted_id})).to_json()
        return jsonify({'user': user})
    else:
        return jsonify({'error': 'User Already Exits With Same Email, Please Log In'})


@users.route("/user/<user_id>", methods=['DELETE'])
@carbon_auth.auth.login_required
def delete_user(user_id: str) -> Response:
    query = {"_id": ObjectId(user_id)}
    item = CarbonTrackDB.users_coll.find_one(query)
    item = User.from_json(item).to_json()
    CarbonTrackDB.users_coll.delete_one(query)
    return jsonify({'deleted user': item})


@users.route("user/<user_id>", methods=["PATCH"])
@carbon_auth.auth.login_required
def update_user(user_id: str) -> Response:
    query = {"_id": ObjectId(user_id)}
    user = User.from_json(request.get_json()['user']).to_json()
    del user['_id']
    CarbonTrackDB.users_coll.update_one(query, {'$set': user})
    item = CarbonTrackDB.users_coll.find_one(query)
    item = User.from_json(item).to_json()
    return jsonify({'updated_user': item})


