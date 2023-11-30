"""
Energy Model
"""

from __future__ import annotations
from typing import Union
import json
from datetime import datetime
from models.abstract_carbon_model import CARBON_MODEL
from bson import ObjectId


class EnergyEntry(CARBON_MODEL):
    oid: ObjectId
    user_id: ObjectId
    carbon_emissions: int  # measured in kgs of CO2
    date: datetime
    heating_oil: int  # measured in L of fuel
    natural_gas: int  # measured in m3 of gas
    electricity: int  # measured in kWh
    province: str
    household: int

    def __init__(self, oid: ObjectId, user_id: ObjectId, carbon_emissions: int, date: Union[str, datetime],
                 heating_oil: int, natural_gas: int, province: str, household: int, electricity: int) -> None:
        super().__init__(oid, user_id, carbon_emissions, date)
        self.heating_oil = heating_oil
        self.natural_gas = natural_gas
        self.electricity = electricity
        self.province = province
        self.household = household

    def to_json(self) -> json:
        return {
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

        if self.household < 1:
            self.household = 1

        if self.province == "British Columbia":
            electricity_carbon_emissions = (self.electricity * 0.015) / self.household
        elif self.province == "Alberta":
            electricity_carbon_emissions = (self.electricity * 0.54) / self.household
        elif self.province == "Saskatchewan":
            electricity_carbon_emissions = (self.electricity * 0.73) / self.household
        elif self.province == "Manitoba":
            electricity_carbon_emissions = (self.electricity * 0.002) / self.household
        elif self.province == "Ontario":
            electricity_carbon_emissions = (self.electricity * 0.03) / self.household
        elif self.province == "Quebec":
            electricity_carbon_emissions = (self.electricity * 0.0017) / self.household
        elif self.province == "New Brunswick":
            electricity_carbon_emissions = (self.electricity * 0.3) / self.household
        elif self.province == "Nova Scotia":
            electricity_carbon_emissions = (self.electricity * 0.69) / self.household
        elif self.province == "PEI":
            electricity_carbon_emissions = (self.electricity * 0.3) / self.household
        elif self.province == "Newfoundland and Labrador":
            electricity_carbon_emissions = (self.electricity * 0.017) / self.household
        elif self.province == "Yukon":
            electricity_carbon_emissions = (self.electricity * 0.08) / self.household
        elif self.province == "Northwest Territories":
            electricity_carbon_emissions = (self.electricity * 0.17) / self.household
        else:  # self.province == "Nunavut"
            electricity_carbon_emissions = (self.electricity * 0.84) / self.household
        return sum([heating_oil_carbon_emissions, natural_gas_carbon_emissions, electricity_carbon_emissions])

    def __repr__(self) -> str:
        return f'Energy ID: {self.oid.__str__()}'
