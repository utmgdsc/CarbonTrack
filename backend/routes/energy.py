# Python Imports
from datetime import datetime
from bson import ObjectId
from flask import Blueprint, Response, jsonify, request

from models.energy import EnergyEntry
from mongodb_api.carbon_track_db import CarbonTrackDB
from routes import carbon_auth, users
from utils.metric_resets import weekly_metric_reset, get_1_day_range

energy_service = Blueprint('/energy', __name__)


@energy_service.route("/energy/<oid>", methods=['GET'])
#@carbon_auth.auth.login_required
def get_energy(oid: str) -> Response:
    query = {"_id": ObjectId(oid)}
    item = CarbonTrackDB.energy_coll.find_one(query)
    item = EnergyEntry.from_json(item).to_json()
    return jsonify({'energy': item})


@energy_service.route("/get_energy_metric_for_today/<user_id>", methods=['GET'])
#@carbon_auth.auth.login_required
def get_energy_metric_for_today(user_id: str) -> Response:
    start_of_day, end_of_day = get_1_day_range(datetime.now())
    query = {"user_id": ObjectId(user_id), "date": {"$gte": start_of_day, "$lte": end_of_day}}
    item = CarbonTrackDB.energy_coll.find_one(query)
    if item is None:
        create_energy(ObjectId(user_id))
        return get_energy_metric_for_today(user_id=user_id)
    else:
        item = EnergyEntry.from_json(item).to_json()
        return jsonify({'energy': item})


#@carbon_auth.auth.login_required
def create_energy(user_id: ObjectId) -> Response:
    user = users.get_user_obj(user_id)
    energy = EnergyEntry(oid=ObjectId(), user_id=user_id, heating_oil = 0, natural_gas = 0, province = user.province, 
                 household = user.household, electricity = 0, carbon_emissions=0.0, date=weekly_metric_reset(datetime.today()))
    energy = energy.to_json(for_mongodb=True)
    inserted_id = CarbonTrackDB.energy_coll.insert_one(energy).inserted_id
    energy = EnergyEntry.from_json(CarbonTrackDB.energy_coll.find_one({"_id": inserted_id})).to_json()
    return energy


@energy_service.route("/energy/<oid>", methods=["PATCH"])
#@carbon_auth.auth.login_required
def update_energy(oid: str) -> Response:
    query = {"_id": ObjectId(oid)}
    energy = EnergyEntry.from_json(request.get_json()['energy']).to_json(for_mongodb=True)
    CarbonTrackDB.energy_coll.update_one(query, {'$set': energy})
    item = CarbonTrackDB.energy_coll.find_one(query)
    item = EnergyEntry.from_json(item).to_json()
    return jsonify({'updated_energy': item})
