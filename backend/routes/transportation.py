# Python Imports
from datetime import datetime
from bson import ObjectId
from flask import Blueprint, Response, abort, jsonify, request
import flask
from models.user import User
from models.transportation import TransportationEntry, TransportationEntryRecommendation
from mongodb_api.carbon_track_db import CarbonTrackDB
from routes import carbon_auth
from utils.carbon_track_errors import CarbonTrackError
from utils.metric_resets import weekly_metric_reset
from utils.FirebaseAPI import FirebaseAPI

transportation_service = Blueprint('/transportation', __name__)

@transportation_service.route("/transportation/<oid>", methods=['GET'])
@carbon_auth.auth.login_required
def get_transportation(oid: str) -> Response:
    try:
        query = {"_id": ObjectId(oid)}
        item = CarbonTrackDB.transportation_coll.find_one(query)
        item = TransportationEntry.from_json(item).to_json()
        return jsonify({"transportation": item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@transportation_service.route("/get_transportation_entries_for_user_using_data_range", methods=['POST'])
@carbon_auth.auth.login_required
def get_transportation_entries_for_user_using_date_range() -> Response:
    try:
        user = FirebaseAPI.get_user(flask.request.headers.get('Authorization').split()[1])
        data = request.get_json()
        start = datetime.fromisoformat(data.get('start'))
        end = datetime.fromisoformat(data.get('end'))
        # Validate that both start and end dates are provided
        if not start or not end:
            return jsonify({'error': 'Both start and end dates are required'})

        query = {"user_id": ObjectId(user.oid), "date": {"$gte": start, "$lte": end}}
        items = list(CarbonTrackDB.transportation_coll.find(query))
        transportation_items: list[TransportationEntry] = [TransportationEntry.from_json(item) for item in items]
        json_items = [item.to_json() for item in transportation_items]
        return jsonify({
            'transportationEntries': json_items,
            'monthlyData': TransportationEntry.get_monthly_view(start, end, transportation_items)
        })
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@transportation_service.route("/get_transportation_metric_for_today", methods=['GET'])
@carbon_auth.auth.login_required
def get_transportation_metric_for_today() -> Response:
    try:
        user = FirebaseAPI.get_user(flask.request.headers.get('Authorization').split()[1])
        query = {"user_id": ObjectId(user.oid), "date": weekly_metric_reset(datetime.now())}
        item = CarbonTrackDB.transportation_coll.find_one(query)
        if item is None:
            create_transportation(ObjectId(user.oid))
            return get_transportation_metric_for_today()
        else:
            item = TransportationEntry.from_json(item).to_json()
            return jsonify({'transportation': item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@carbon_auth.auth.login_required
def create_transportation(user_id: ObjectId) -> Response:
    try:
        user = User.from_json(CarbonTrackDB.users_coll.find_one({'_id': user_id}))
        transportation = TransportationEntry(oid=ObjectId(), user_id=user_id, carbon_emissions=0, date=weekly_metric_reset(datetime.today()),
                                             bus=0, train=0, motorbike=0, electric_car=0, gasoline_car=0, fuel_efficiency=user.fuel_efficiency)
        transportation = transportation.to_json()
        inserted_id = CarbonTrackDB.transportation_coll.insert_one(transportation).inserted_id
        transportation = TransportationEntry.from_json(CarbonTrackDB.transportation_coll.find_one({"_id": inserted_id})).to_json()
        return transportation
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@transportation_service.route("/transportation/<oid>", methods=["PATCH"])
@carbon_auth.auth.login_required
def update_transportation(oid: str) -> Response:
    try:
        query = {"_id": ObjectId(oid)}
        transportation: dict = TransportationEntry.from_json(request.get_json()['transportation']).to_json()
        del transportation['_id']
        del transportation['date']
        del transportation['user_id']
        CarbonTrackDB.transportation_coll.update_one(query, {'$set': transportation})
        item = CarbonTrackDB.transportation_coll.find_one(query)
        item = TransportationEntry.from_json(item).to_json()
        return jsonify({'transportation': item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@transportation_service.route("/get_transportation_recommendation_for_today", methods=['GET'])
@carbon_auth.auth.login_required
def get_transportation_recommendation_for_today() -> Response:
    try:
        user = FirebaseAPI.get_user(flask.request.headers.get('Authorization').split()[1])
        query = {"user_id": ObjectId(user.oid), "date": weekly_metric_reset(datetime.now())}
        item = CarbonTrackDB.transportation_coll.find_one(query)
        if item is None:
            create_transportation(ObjectId(user.oid))
            return get_transportation_recommendation_for_today()
        else:
            item = TransportationEntry.from_json(item)
            recommendation = TransportationEntryRecommendation.from_transportation_entry(item).to_json()
            return jsonify({'transportation_recommendation': recommendation})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")
