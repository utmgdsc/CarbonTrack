"""
Transportation Model
"""

from __future__ import annotations
from typing import Union
import json
from datetime import datetime
from models.abstract_carbon_model import CARBON_MODEL
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

    def __init__(self, oid: ObjectId, user_id: ObjectId, carbon_emissions: int, date: Union[str, datetime],
                 bus: int, train: int, motorbike: int, electric_car: int, gasoline_car: int) -> None:
        super().__init__(oid, user_id, carbon_emissions, date)
        self.bus = bus
        self.train = train
        self.motorbike = motorbike
        self.electric_car = electric_car
        self.gasoline_car = gasoline_car

    def to_json(self) -> json:
        return {
            "_id": self.oid,
            "user_id": self.user_id,
            "bus": self.bus,
            "train": self.train,
            "motorbike": self.motorbike,
            "electric_car": self.electric_car,
            "gasoline_car": self.gasoline_car,
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
            carbon_emissions=doc["carbon_emissions"],
            date=doc["date"]
        )

    def calculate_carbon_emissions(self) -> int:
        bus_carbon_emissions = self.bus * 0.103
        train_carbon_emissions = self.train * 0.037
        motorbike_carbon_emissions = self.motorbike * 0.113
        electric_car_carbon_emissions = self.electric_car * 0.4
        gasoline_car_carbon_emissions = self.gasoline_car * 2.3
        return int(sum([bus_carbon_emissions, train_carbon_emissions, motorbike_carbon_emissions,
                        electric_car_carbon_emissions, gasoline_car_carbon_emissions]))

    def __repr__(self) -> str:
        return f"Transportation ID: {self.oid.__str__()}"
