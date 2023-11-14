# Python Imports
import base64
from datetime import datetime
import json
from io import BytesIO
import pprint

import flask
from bson import ObjectId
from flask import Blueprint, Response, jsonify, request

from models.transportation import TransportationEntry
from mongodb_api.carbon_track_db import CarbonTrackDB
from bson import json_util
from routes import carbon_auth
from utils.metric_resets import weekly_metric_reset, get_1_day_range

transportation_service = Blueprint('/transportation', __name__)


@transportation_service.route("/transportation/<oid>", methods=['GET'])
@carbon_auth.auth.login_required
def get_transportation(oid: str) -> Response:
    query = {"_id": ObjectId(oid)}
    item = CarbonTrackDB.transportation_coll.find_one(query)
    item = TransportationEntry.from_json(item).to_json()
    return jsonify({'transportation': item})


@transportation_service.route("/get_transportation_metric_for_today/<user_id>", methods=['GET'])
@carbon_auth.auth.login_required
def get_transportation_metric_for_today(user_id: str) -> Response:
    start_of_day, end_of_day = get_1_day_range(datetime.now())
    query = {"user_id": ObjectId(user_id), "date": {"$gte": start_of_day, "$lte": end_of_day}}
    item = CarbonTrackDB.transportation_coll.find_one(query)
    if item is None:
        create_transportation(ObjectId(user_id))
        return get_transportation_metric_for_today(user_id=user_id)
    else:
        item = TransportationEntry.from_json(item).to_json()
        return jsonify({'transportation': item})


@carbon_auth.auth.login_required
def create_transportation(user_id: ObjectId) -> Response:
    transportation = TransportationEntry(oid=ObjectId(), user_id=user_id, bus=0, train=0, motorbike=0, plane=0, electric_car=0,
                                         gasoline_car=0, carbon_emissions=0.0, date=weekly_metric_reset(datetime.today()))
    transportation = transportation.to_json(for_mongodb=True)
    inserted_id = CarbonTrackDB.transportation_coll.insert_one(transportation).inserted_id
    transportation = TransportationEntry.from_json(CarbonTrackDB.transportation_coll.find_one({"_id": inserted_id})).to_json()
    return transportation


@transportation_service.route("/transportation/<oid>", methods=["PATCH"])
@carbon_auth.auth.login_required
def update_transportation(oid: str) -> Response:
    query = {"_id": ObjectId(oid)}
    transportation = TransportationEntry.from_json(request.get_json()['transportation']).to_json(for_mongodb=True)
    CarbonTrackDB.transportation_coll.update_one(query, {'$set': transportation})
    item = CarbonTrackDB.transportation_coll.find_one(query)
    item = TransportationEntry.from_json(item).to_json()
    return jsonify({'updated_transportation': item})
