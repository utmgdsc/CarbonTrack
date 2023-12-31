# Python Imports
from bson import ObjectId
from flask import Blueprint, Response, abort, jsonify, request
from models.user import User
from mongodb_api.carbon_track_db import CarbonTrackDB
from routes import carbon_auth
from utils.carbon_track_errors import CarbonTrackError
from pymongo.collection import ReturnDocument
from flask import g

users = Blueprint("/users", __name__)


@users.route("/user/<user_id>", methods=["GET"])
@carbon_auth.auth.login_required
def get_user(user_id: str) -> Response:
    try:
        query = {"_id": ObjectId(user_id), "archived": False}
        item = CarbonTrackDB.users_coll.find_one(query)
        item = User.from_json(item).to_json()
        return jsonify({"user": item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@users.route("/get_top_users", methods=["POST"])
@carbon_auth.auth.login_required
def get_top_users() -> Response:
    try:
        count = request.get_json()["count"]

        # Monthly
        _top_monthly_users = (
            CarbonTrackDB.users_coll.find({"archived": False}).sort("monthly_score", -1).limit(count)
        )
        top_monthly_users = []
        rank = 1
        for user in _top_monthly_users:
            obj = User.from_json(user)
            user = {
                "rank": rank,
                "name": obj.full_name,
                "footprint": obj.monthly_emissions,
                "score": obj.overall_score,
            }
            rank += 1
            top_monthly_users.append(user)

        # Yearly
        _top_yearly_users = (
            CarbonTrackDB.users_coll.find().sort("yearly_score", -1).limit(count)
        )
        top_yearly_users = []
        rank = 1
        for user in _top_yearly_users:
            obj = User.from_json(user)
            user = {
                "rank": rank,
                "name": obj.full_name,
                "footprint": obj.yearly_emissions,
                "score": obj.overall_score,
            }
            rank += 1
            top_yearly_users.append(user)

        # Overall
        _top_overall_users = (
            CarbonTrackDB.users_coll.find().sort("overall_score", -1).limit(count)
        )
        top_overall_users = []
        rank = 1
        for user in _top_overall_users:
            obj = User.from_json(user)
            user = {
                "rank": rank,
                "name": obj.full_name,
                "footprint": obj.overall_emissions,
                "score": obj.overall_score,
            }
            rank += 1
            top_overall_users.append(user)

        return jsonify(
            {
                "top_monthly_users": top_monthly_users,
                "top_yearly_users": top_yearly_users,
                "top_overall_users": top_overall_users,
            }
        )

    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@users.route("/user_email/<user_email>", methods=["GET"])
@carbon_auth.auth.login_required
def get_user_by_email(user_email: str) -> Response:
    try:
        query = {"email": user_email, "archived": False}
        item = CarbonTrackDB.users_coll.find_one(query)
        item = User.from_json(item).to_json()
        return jsonify({"user": item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@users.route("/current", methods=["GET"])
@carbon_auth.auth.login_required
def get_current_user() -> Response:
    try:
        current_user = g.current_user

        print(current_user)

        # Construct the query to find the user in MongoDB
        query = {"uid": current_user["uid"], "archived": False}

        # Fetch user data from MongoDB
        mongo_user = CarbonTrackDB.users_coll.find_one(query)

        # Check if user exists in MongoDB and update if necessary
        if mongo_user is not None:
            # Check if the email in Firebase and MongoDB are different
            if mongo_user.get("email") != current_user["email"]:
                update = {"$set": {"email": current_user["email"]}}
                mongo_user = CarbonTrackDB.users_coll.find_one_and_update(
                    query, update, return_document=ReturnDocument.AFTER
                )
        else:
            # Handle case where user is not found in MongoDB
            abort(code=404, description="User not found in database")

        user_data = User.from_json(mongo_user).to_json()
        return jsonify({"user": user_data})
    except CarbonTrackError as e:
        abort(code=400, description=str(e))


@users.route("/user", methods=["PUT"])
@carbon_auth.auth.login_required
def create_user() -> Response:
    res: dict = request.get_json()["user"]
    user = User.from_json(res)
    user.email = user.email.lower()

    query = {"email": user.email}
    item = CarbonTrackDB.users_coll.find_one(query)
    if item is None:
        user = user.to_json()
        inserted_id = CarbonTrackDB.users_coll.insert_one(user).inserted_id
        user = User.from_json(
            CarbonTrackDB.users_coll.find_one({"_id": inserted_id})
        ).to_json()
        return jsonify({"user": user})
    else:
        return jsonify({"error": "User Already Exits With Same Email, Please Log In"})


@users.route("/user/<user_id>", methods=["DELETE"])
@carbon_auth.auth.login_required
def delete_user(user_id: str) -> Response:
    try:
        query = {"_id": ObjectId(user_id), "archived": False}
        item = CarbonTrackDB.users_coll.find_one(query)
        item = User.from_json(item)
        CarbonTrackDB.users_coll.update_one(query, {
            '$set': {
                'archived': True
            }
        })
        return jsonify({"user": item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@users.route("user/<user_id>", methods=["PATCH"])
@carbon_auth.auth.login_required
def update_user(user_id: str) -> Response:
    try:
        query = {"_id": ObjectId(user_id), "archived": False}
        user = User.from_json(request.get_json()["user"]).to_json()
        del user["_id"]
        del user["email"]
        CarbonTrackDB.users_coll.update_one(query, {"$set": user})
        item = CarbonTrackDB.users_coll.find_one(query)
        item = User.from_json(item).to_json()
        return jsonify({"user": item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@users.route("/user/update_email/<user_id>", methods=["PATCH"])
@carbon_auth.auth.login_required
def update_user_email(uid: str) -> Response:
    try:
        query = {"uid": uid, "archived": False}
        new_email = request.get_json().get("email", "")

        current_user = carbon_auth.auth.current_user()
        print(current_user)

        CarbonTrackDB.users_coll.update_one(query, {"$set": {"email": new_email}})

        item = CarbonTrackDB.users_coll.find_one(query)

        item = User.from_json(item).to_json()

        return jsonify({"user": item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@users.route("/user/update_name/<user_id>", methods=["PATCH"])
@carbon_auth.auth.login_required
def update_user_name(user_id: str) -> Response:
    try:
        new_name = request.get_json().get("newName", "")

        query = {"uid": user_id, "archived": False}

        current_user = carbon_auth.auth.current_user()
        print(current_user)

        CarbonTrackDB.users_coll.update_one(query, {"$set": {"full_name": new_name}})

        item = CarbonTrackDB.users_coll.find_one(query)

        item = User.from_json(item).to_json()

        return jsonify({"user": item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")
