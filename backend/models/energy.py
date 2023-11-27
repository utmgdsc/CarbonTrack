"""
Energy Model
"""

from __future__ import annotations
import json
from datetime import datetime
from models.abstract_db_model import DB_MODEL
from bson import ObjectId
from bson import json_util


class EnergyEntry(DB_MODEL):
    oid: ObjectId
    user_id: ObjectId
    heating_oil: int # measured in L of fuel
    natural_gas: int # measured in m3 of gas
    electricity: int # measured in kWh
    province: str
    household: int
    carbon_emissions: float # measured in kgs of CO2
    date: datetime

    def __init__(self, oid: ObjectId, user_id: ObjectId, heating_oil: int, natural_gas: int, province: str, 
                 household: int, electricity: int, carbon_emissions: float, date: datetime) -> None:
        super().__init__(oid)
        self.user_id = ObjectId(user_id)
        self.heating_oil = heating_oil
        self.natural_gas = natural_gas
        self.electricity = electricity
        self.province = province
        self.household = household
        self.carbon_emissions = carbon_emissions
        self.date = date

    def to_json(self, for_mongodb: bool = False) -> json:
        res = {
            '_id': self.oid,
            'user_id': self.user_id,
            'heating_oil': self.heating_oil,
            'natural_gas': self.natural_gas,
            'electricity': self.electricity,
            'province': self.province,
            'household': self.household,
            'carbon_emissions': self.calculate_carbon_emissions(),
            'date': self.date
        }
        if for_mongodb:
            return res
        return json.loads(json_util.dumps(res))

    @staticmethod
    def from_json(doc: json) -> EnergyEntry:
        return EnergyEntry(
            oid=ObjectId(doc["_id"]),
            user_id=doc['user_id'],
            heating_oil=doc["heating_oil"],
            natural_gas=doc["natural_gas"],
            electricity=doc["electricity"],
            province=doc["province"],
            household=doc["household"],
            carbon_emissions=doc["carbon_emissions"],
            date=doc["date"]
        )

    def calculate_carbon_emissions(self) -> float:
        heating_oil_carbon_emissions = self.heating_oil * 2.753
        natural_gas_carbon_emissions = self.natural_gas * 1.96

        if self.province == "British Columbia":
            electricity_carbon_emissions = (self.electricity * 0.015)/self.household
        elif self.province == "Alberta":
            electricity_carbon_emissions = (self.electricity * 0.54)/self.household
        elif self.province == "Saskatchewan":
            electricity_carbon_emissions = (self.electricity * 0.73)/self.household
        elif self.province == "Manitoba":
            electricity_carbon_emissions = (self.electricity * 0.002)/self.household
        elif self.province == "Ontario":
            electricity_carbon_emissions = (self.electricity * 0.03)/self.household
        elif self.province == "Quebec":
            electricity_carbon_emissions = (self.electricity * 0.0017)/self.household
        elif self.province == "New Brunswick":
            electricity_carbon_emissions = (self.electricity * 0.3)/self.household
        elif self.province == "Nova Scotia":
            electricity_carbon_emissions = (self.electricity * 0.69)/self.household
        elif self.province == "PEI":
            electricity_carbon_emissions = (self.electricity * 0.3)/self.household
        elif self.province == "Newfoundland and Labrador":
            electricity_carbon_emissions = (self.electricity * 0.017)/self.household
        elif self.province == "Yukon":
            electricity_carbon_emissions = (self.electricity * 0.08)/self.household
        elif self.province == "Nortwest Territories":
            electricity_carbon_emissions = (self.electricity * 0.17)/self.household
        else: # self.province == "Nunavut"
            electricity_carbon_emissions = (self.electricity * 0.84)/self.household
        return sum([heating_oil_carbon_emissions, natural_gas_carbon_emissions, electricity_carbon_emissions])

    def __repr__(self) -> str:
        return f'Energy ID: {self.oid.__str__()}'
