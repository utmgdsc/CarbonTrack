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
    metric_threshold = 200/3

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


class EnergyEntryRecommendation(CARBON_MODEL):
    heating_oil_recommendation: str  
    natural_gas_recommendation: str 
    electricity_recommendation: str 

    def __init__(self, heating_oil_recommendation: int, natural_gas_recommendation: int, electricity_recommendation: int) -> None:
        self.heating_oil_recommendation = heating_oil_recommendation
        self.natural_gas_recommendation = natural_gas_recommendation
        self.electricity_recommendation = electricity_recommendation

    def to_json(self) -> json:
        return {
            'heating_oil_recommendation': self.heating_oil_recommendation,
            'natural_gas_recommendation': self.natural_gas_recommendation,
            'electricity_recommendation': self.electricity_recommendation
        }

    @staticmethod
    def from_json(doc: json) -> EnergyEntry:
        return EnergyEntry(
            heating_oil_recommendation=doc["heating_oil_recommendation"],
            natural_gas_recommendation=doc["natural_gas_recommendation"],
            electricity_recommendation=doc["electricity_recommendation"]
        )

    def from_energy_entry(energy_entry: EnergyEntry) -> EnergyEntryRecommendation:
        submetric_threshold = EnergyEntry.metric_threshold/3
        heating_oil_recommendation = ""
        natural_gas_recommendation = "" 
        electricity_recommendation = ""

        heating_oil_carbon_emissions = energy_entry.heating_oil * 2.753
        natural_gas_carbon_emissions = energy_entry.natural_gas * 1.96

        if energy_entry.household < 1:
            energy_entry.household = 1

        if energy_entry.province == "British Columbia":
            electricity_carbon_emissions = (energy_entry.electricity * 0.015) / energy_entry.household
        elif energy_entry.province == "Alberta":
            electricity_carbon_emissions = (energy_entry.electricity * 0.54) / energy_entry.household
        elif energy_entry.province == "Saskatchewan":
            electricity_carbon_emissions = (energy_entry.electricity * 0.73) / energy_entry.household
        elif energy_entry.province == "Manitoba":
            electricity_carbon_emissions = (energy_entry.electricity * 0.002) / energy_entry.household
        elif energy_entry.province == "Ontario":
            electricity_carbon_emissions = (energy_entry.electricity * 0.03) / energy_entry.household
        elif energy_entry.province == "Quebec":
            electricity_carbon_emissions = (energy_entry.electricity * 0.0017) / energy_entry.household
        elif energy_entry.province == "New Brunswick":
            electricity_carbon_emissions = (energy_entry.electricity * 0.3) / energy_entry.household
        elif energy_entry.province == "Nova Scotia":
            electricity_carbon_emissions = (energy_entry.electricity * 0.69) / energy_entry.household
        elif energy_entry.province == "PEI":
            electricity_carbon_emissions = (energy_entry.electricity * 0.3) / energy_entry.household
        elif energy_entry.province == "Newfoundland and Labrador":
            electricity_carbon_emissions = (energy_entry.electricity * 0.017) / energy_entry.household
        elif energy_entry.province == "Yukon":
            electricity_carbon_emissions = (energy_entry.electricity * 0.08) / energy_entry.household
        elif energy_entry.province == "Northwest Territories":
            electricity_carbon_emissions = (energy_entry.electricity * 0.17) / energy_entry.household
        else:  # self.province == "Nunavut"
            electricity_carbon_emissions = (energy_entry.electricity * 0.84) / energy_entry.household

        if heating_oil_carbon_emissions > submetric_threshold:
            heating_oil_recommendation = "Heating oil emissions too high"

        if natural_gas_carbon_emissions > submetric_threshold:
            natural_gas_recommendation = "Natural gas emissions too high"

        if electricity_carbon_emissions > submetric_threshold:
            electricity_recommendation = "Electricity emissions too high"

        return EnergyEntryRecommendation(heating_oil_recommendation, natural_gas_recommendation, electricity_recommendation)
        

    def __repr__(self) -> str:
        return f'Energy ID: {self.oid.__str__()}'
