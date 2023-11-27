# Python Imports
from datetime import datetime
import flask
from bson import ObjectId
from flask import Blueprint, Response, abort, jsonify, request
from models.energy import EnergyEntry
from models.user import User
from mongodb_api.carbon_track_db import CarbonTrackDB
from routes import carbon_auth
from utils.FirebaseAPI import FirebaseAPI
from utils.carbon_track_errors import CarbonTrackError
from utils.metric_resets import weekly_metric_reset

energy_service = Blueprint('/energy', __name__)


@energy_service.route("/energy/<oid>", methods=['GET'])
@carbon_auth.auth.login_required
def get_energy(oid: str) -> Response:
    try:
        query = {"_id": ObjectId(oid)}
        item = CarbonTrackDB.energy_coll.find_one(query)
        item = EnergyEntry.from_json(item).to_json()
        return jsonify({'energy': item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@energy_service.route("/get_energy_entries_for_user_using_data_range", methods=['POST'])
@carbon_auth.auth.login_required
def get_energy_entries_for_user_using_date_range() -> Response:
    try:
        user = FirebaseAPI.get_user(flask.request.headers.get('Authorization').split()[1])
        data = request.get_json()
        start = datetime.fromisoformat(data.get('start'))
        end = datetime.fromisoformat(data.get('end'))
        # Validate that both start and end dates are provided
        if not start or not end:
            return jsonify({'error': 'Both start and end dates are required'})

        query = {"user_id": ObjectId(user.oid), "date": {"$gte": start, "$lte": end}}
        items = list(CarbonTrackDB.energy_coll.find(query))
        energy_items: list[EnergyEntry] = [EnergyEntry.from_json(item) for item in items]
        json_items = [item.to_json() for item in energy_items]
        return jsonify({
            'energyEntries': json_items,
            'monthlyData': EnergyEntry.get_monthly_view(start, end, energy_items)
        })
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@energy_service.route("/get_energy_metric_for_today", methods=['GET'])
@carbon_auth.auth.login_required
def get_energy_metric_for_today() -> Response:
    try:
        user = FirebaseAPI.get_user(flask.request.headers.get('Authorization').split()[1])
        query = {"user_id": ObjectId(user.oid), "date": weekly_metric_reset(datetime.now())}
        item = CarbonTrackDB.energy_coll.find_one(query)
        if item is None:
            create_energy(ObjectId(user.oid))
            return get_energy_metric_for_today()
        else:
            item = EnergyEntry.from_json(item).to_json()
            return jsonify({'energy': item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@carbon_auth.auth.login_required
def create_energy(user_id: ObjectId) -> Response:
    try:
        user = User.from_json(CarbonTrackDB.users_coll.find_one({'_id'}))
        energy = EnergyEntry(oid=ObjectId(), user_id=user_id, carbon_emissions=0, date=weekly_metric_reset(datetime.today()),
                             heating_oil=0, natural_gas=0, province=user.province, household=user.household, electricity=0)
        energy = energy.to_json()
        inserted_id = CarbonTrackDB.energy_coll.insert_one(energy).inserted_id
        energy = EnergyEntry.from_json(CarbonTrackDB.energy_coll.find_one({"_id": inserted_id})).to_json()
        return energy
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")


@energy_service.route("/energy/<oid>", methods=["PATCH"])
@carbon_auth.auth.login_required
def update_energy(oid: str) -> Response:
    try:
        query = {"_id": ObjectId(oid)}
        energy = EnergyEntry.from_json(request.get_json()['energy']).to_json()
        del energy['_id']
        del energy['date']
        del energy['user_id']
        CarbonTrackDB.energy_coll.update_one(query, {'$set': energy})
        item = CarbonTrackDB.energy_coll.find_one(query)
        item = EnergyEntry.from_json(item).to_json()
        return jsonify({'updated_energy': item})
    except CarbonTrackError as e:
        abort(code=400, description=f"{e}")
