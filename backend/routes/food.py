# Python Imports
from datetime import datetime
from bson import ObjectId
from flask import Blueprint, Response, jsonify, request

from models.food import FoodEntry
from mongodb_api.carbon_track_db import CarbonTrackDB
from routes import carbon_auth
from utils.metric_resets import weekly_metric_reset, get_1_day_range

food_service = Blueprint('/food', __name__)


@food_service.route("/food/<oid>", methods=['GET'])
@carbon_auth.auth.login_required
def get_food(oid: str) -> Response:
    query = {"_id": ObjectId(oid)}
    item = CarbonTrackDB.food_coll.find_one(query)
    item = FoodEntry.from_json(item).to_json()
    return jsonify({'food': item})


@food_service.route("/get_food_metric_for_today/<user_id>", methods=['GET'])
@carbon_auth.auth.login_required
def get_food_metric_for_today(user_id: str) -> Response:
    start_of_day, end_of_day = get_1_day_range(datetime.now())
    query = {"user_id": ObjectId(user_id), "date": {"$gte": start_of_day, "$lte": end_of_day}}
    item = CarbonTrackDB.food_coll.find_one(query)
    if item is None:
        create_food(ObjectId(user_id))
        return get_food_metric_for_today(user_id=user_id)
    else:
        item = FoodEntry.from_json(item).to_json()
        return jsonify({'food': item})


@carbon_auth.auth.login_required
def create_food(user_id: ObjectId) -> Response:
    food = FoodEntry(
            oid=ObjectId(),
            user_id=user_id,
            beef=0,
            lamb=0,
            pork=0,
            chicken=0,
            fish=0,
            cheese=0,
            milk=0,
            food_waste=0,
            carbon_emissions=0.0,
            date=weekly_metric_reset(datetime.today()))
        
    food = food.to_json(for_mongodb=True)
    inserted_id = CarbonTrackDB.food_coll.insert_one(food).inserted_id
    food = FoodEntry.from_json(CarbonTrackDB.food_coll.find_one({"_id": inserted_id})).to_json()
    return food


@food_service.route("/food/<oid>", methods=["PATCH"])
@carbon_auth.auth.login_required
def update_food(oid: str) -> Response:
    query = {"_id": ObjectId(oid)}
    food = FoodEntry.from_json(request.get_json()['food']).to_json(for_mongodb=True)
    CarbonTrackDB.food_coll.update_one(query, {'$set': food})
    item = CarbonTrackDB.food_coll.find_one(query)
    item = FoodEntry.from_json(item).to_json()
    return jsonify({'updated_food': item})
