# Python Imports
from datetime import datetime

import flask
from bson import ObjectId
from flask import Blueprint, Response, abort, jsonify, request

from models.food import FoodEntry, FoodEntryRecomendation
from mongodb_api.carbon_track_db import CarbonTrackDB
from routes import carbon_auth
from utils.FirebaseAPI import FirebaseAPI
from utils.carbon_track_errors import CarbonTrackError
from utils.metric_resets import weekly_metric_reset

food_service = Blueprint('/food', __name__)


@food_service.route("/food/<oid>", methods=['GET'])
@carbon_auth.auth.login_required
def get_food(oid: str) -> Response:
    try:
        query = {"_id": ObjectId(oid)}
        item = CarbonTrackDB.food_coll.find_one(query)
        item = FoodEntry.from_json(item).to_json()
        return jsonify({'food': item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@food_service.route("/get_food_entries_for_user_using_data_range", methods=['POST'])
@carbon_auth.auth.login_required
def get_food_entries_for_user_using_date_range() -> Response:
    try:
        user = FirebaseAPI.get_user(flask.request.headers.get('Authorization').split()[1])
        data = request.get_json()
        start = datetime.fromisoformat(data.get('start'))
        end = datetime.fromisoformat(data.get('end'))
        # Validate that both start and end dates are provided
        if not start or not end:
            return jsonify({'error': 'Both start and end dates are required'})

        query = {"user_id": ObjectId(user.oid), "date": {"$gte": start, "$lte": end}}
        items = list(CarbonTrackDB.food_coll.find(query))
        food_items: list[FoodEntry] = [FoodEntry.from_json(item) for item in items]
        json_items = [item.to_json() for item in food_items]
        return jsonify({
            'foodEntries': json_items,
            'monthlyData': FoodEntry.get_monthly_view(start, end, food_items)
        })
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@food_service.route("/get_food_metric_for_today", methods=['GET'])
@carbon_auth.auth.login_required
def get_food_metric_for_today() -> Response:
    try:
        user = FirebaseAPI.get_user(flask.request.headers.get('Authorization').split()[1])
        query = {"user_id": ObjectId(user.oid), "date": weekly_metric_reset(datetime.now())}
        item = CarbonTrackDB.food_coll.find_one(query)
        if item is None:
            create_food(ObjectId(user.oid))
            return get_food_metric_for_today()
        else:
            item = FoodEntry.from_json(item).to_json()
            return jsonify({'food': item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@carbon_auth.auth.login_required
def create_food(user_id: ObjectId) -> Response:
    try:
        food = FoodEntry(
                oid=ObjectId(), user_id=user_id, carbon_emissions=0, date=weekly_metric_reset(datetime.today()),
                beef=0, lamb=0, pork=0, chicken=0, fish=0, cheese=0, milk=0, food_waste=0)
        food = food.to_json()
        inserted_id = CarbonTrackDB.food_coll.insert_one(food).inserted_id
        food = FoodEntry.from_json(CarbonTrackDB.food_coll.find_one({"_id": inserted_id})).to_json()
        return food
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@food_service.route("/food/<oid>", methods=["PATCH"])
@carbon_auth.auth.login_required
def update_food(oid: str) -> Response:
    try:
        query = {"_id": ObjectId(oid)}
        food = FoodEntry.from_json(request.get_json()['food']).to_json()
        del food['_id']
        del food['date']
        del food['user_id']
        CarbonTrackDB.food_coll.update_one(query, {'$set': food})
        item = CarbonTrackDB.food_coll.find_one(query)
        item = FoodEntry.from_json(item).to_json()
        return jsonify({'food': item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@food_service.route("/get_food_recommendation_for_today", methods=['GET'])
@carbon_auth.auth.login_required
def get_food_recommendation_for_today() -> Response:
    try:
        user = FirebaseAPI.get_user(flask.request.headers.get('Authorization').split()[1])
        query = {"user_id": ObjectId(user.oid), "date": weekly_metric_reset(datetime.now())}
        item = CarbonTrackDB.food_coll.find_one(query)
        if item is None:
            create_food(ObjectId(user.oid))
            return get_food_metric_for_today()
        else:
            item = FoodEntry.from_json(item)
            food_recommendation = FoodEntryRecomendation.from_food_entry(item).to_json()
            return jsonify({'food_recommendation': food_recommendation})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")