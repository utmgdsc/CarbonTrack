"""
Transportation Model
"""

from __future__ import annotations
from typing import Union
import json
import random
from datetime import datetime
from models.abstract_carbon_model import CARBON_MODEL
from models.abstract_db_model import DB_MODEL
from bson import ObjectId


class TransportationEntry(CARBON_MODEL):
    oid: ObjectId
    user_id: ObjectId
    carbon_emissions: int
    date: datetime
    bus: int
    train: int
    motorbike: int
    electric_car: int
    gasoline_car: int
    fuel_efficieny: float

    def __init__(self, oid: ObjectId, user_id: ObjectId, carbon_emissions: int, date: Union[str, datetime],
                 bus: int, train: int, motorbike: int, electric_car: int, gasoline_car: int, fuel_efficiency: float) -> None:
        super().__init__(oid, user_id, carbon_emissions, date)
        self.bus = bus
        self.train = train
        self.motorbike = motorbike
        self.electric_car = electric_car
        self.gasoline_car = gasoline_car
        self.fuel_efficiency = fuel_efficiency

    def to_json(self) -> json:
        return {
            "_id": self.oid,
            "user_id": self.user_id,
            "bus": self.bus,
            "train": self.train,
            "motorbike": self.motorbike,
            "electric_car": self.electric_car,
            "gasoline_car": self.gasoline_car,
            "fuel_efficiency": self.fuel_efficiency,
            "carbon_emissions": self.calculate_carbon_emissions(),
            "date": self.date
        }

    @staticmethod
    def from_json(doc: json) -> TransportationEntry:
        return TransportationEntry(
            oid=ObjectId(doc["_id"]),
            user_id=ObjectId(doc["user_id"]),
            bus=doc["bus"],
            train=doc["train"],
            motorbike=doc["motorbike"],
            electric_car=doc["electric_car"],
            gasoline_car=doc["gasoline_car"],
            fuel_efficiency=doc["fuel_efficiency"],
            carbon_emissions=doc["carbon_emissions"],
            date=doc["date"]
        )

    def calculate_carbon_emissions(self) -> int:
        bus_carbon_emissions = self.bus * 0.103
        train_carbon_emissions = self.train * 0.037
        motorbike_carbon_emissions = self.motorbike * 0.113
        electric_car_carbon_emissions = ((self.fuel_efficiency * 8.9 * 0.4) / 100) * self.electric_car
        gasoline_car_carbon_emissions = ((self.fuel_efficiency * 2.3) / 100) * self.gasoline_car
        return int(sum([bus_carbon_emissions, train_carbon_emissions, motorbike_carbon_emissions,
                        electric_car_carbon_emissions, gasoline_car_carbon_emissions]))

    def __repr__(self) -> str:
        return f"Transportation ID: {self.oid.__str__()}"


class TransportationEntryRecommendation(DB_MODEL):
    bus_recommendation: str
    train_recommendation: str
    motorbike_recommendation: str
    electric_car_recommendation: str
    gasoline_car_recommendation: str

    def __init__(self, bus_recommendation: str, train_recommendation: str, motorbike_recommendation: str,
                 electric_car_recommendation: str, gasoline_car_recommendation: str) -> None:
        super().__init__(ObjectId())
        self.bus_recommendation = bus_recommendation
        self.train_recommendation = train_recommendation
        self.motorbike_recommendation = motorbike_recommendation
        self.electric_car_recommendation = electric_car_recommendation
        self.gasoline_car_recommendation = gasoline_car_recommendation

    def to_json(self) -> json:
        return {
            "bus_recommendation": self.bus_recommendation,
            "train_recommendation": self.train_recommendation,
            "motorbike_recommendation": self.motorbike_recommendation,
            "electric_car_recommendation": self.electric_car_recommendation,
            "gasoline_car_recommendation": self.gasoline_car_recommendation
        }

    @staticmethod
    def from_json(doc: json) -> TransportationEntryRecommendation:
        return TransportationEntryRecommendation(
            bus_recommendation=doc["bus_recommendation"],
            train_recommendation=doc["train_recommendation"],
            motorbike_recommendation=doc["motorbike_recommendation"],
            electric_car_recommendation=doc["electric_car_recommendation"],
            gasoline_car_recommendation=doc["gasoline_car_recommendation"]
        )

    @staticmethod
    def from_transportation_entry(transportation_entry: TransportationEntry) -> TransportationEntryRecommendation:
        submetric_threshold = 11
        bus_recommendation = "Looking good!"
        train_recommendation = "Looking good!"
        motorbike_recommendation = "Looking good!"
        electric_car_recommendation = "Looking good!"
        gasoline_car_recommendation = "Looking good!"

        bus_carbon_emissions = transportation_entry.bus * 0.103
        train_carbon_emissions = transportation_entry.train * 0.037
        motorbike_carbon_emissions = transportation_entry.motorbike * 0.113
        electric_car_carbon_emissions = ((transportation_entry.fuel_efficiency * 8.9 * 0.4) / 100) * transportation_entry.electric_car
        gasoline_car_carbon_emissions = ((transportation_entry.fuel_efficiency * 2.3) / 100) * transportation_entry.gasoline_car

        if bus_carbon_emissions > submetric_threshold:
            recommendation1 = "Consider walking short distances"
            recommendation2 = "Consider riding an E-Bike or E-scooter when possible"
            recommendation3 = "Consider riding a bicycle when travelling short distances"
            recommendations = [recommendation1, recommendation2, recommendation3]
            bus_recommendation = random.choice(recommendations)

        if train_carbon_emissions > submetric_threshold:
            recommendation1 = "Consider walking short distances"
            recommendation2 = "Consider local public transport when possible (buses, trams)"
            recommendation3 = "Consider riding a bicycle, E-Bike or E-scooter when travelling short distances"
            recommendations = [recommendation1, recommendation2, recommendation3]
            train_recommendation = random.choice(recommendations)

        if motorbike_carbon_emissions > submetric_threshold:
            recommendation1 = "Consider walking or biking short distances"
            recommendation2 = "Consider taking public transportation more often"
            recommendation3 = "Consider carpooling when possible"
            recommendations = [recommendation1, recommendation2, recommendation3]
            motorbike_recommendation = random.choice(recommendations)

        if electric_car_carbon_emissions > submetric_threshold:
            recommendation1 = "Consider taking public transportation more often"
            recommendation2 = "Consider carpooling when possible"
            recommendation3 = "Consider walking or biking short distances"
            recommendations = [recommendation1, recommendation2, recommendation3]
            electric_car_recommendation = random.choice(recommendations)

        if gasoline_car_carbon_emissions > submetric_threshold:
            recommendation1 = "Consider taking public transportation more often"
            recommendation2 = "Consider carpooling when possible"
            recommendation3 = "Consider walking or biking short distances"
            recommendations = [recommendation1, recommendation2, recommendation3]
            gasoline_car_recommendation = random.choice(recommendations)

        return TransportationEntryRecommendation(bus_recommendation, train_recommendation,
                                                 motorbike_recommendation, electric_car_recommendation, gasoline_car_recommendation)

    def __repr__(self) -> str:
        return f"Transportation ID: {self.oid.__str__()}"
