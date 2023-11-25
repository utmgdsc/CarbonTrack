"""
Transportation Model
"""

from __future__ import annotations
from typing import Union
import json
from datetime import datetime, timezone
from models.abstract_db_model import DB_MODEL
from bson import ObjectId


class TransportationEntry(DB_MODEL):
    oid: ObjectId
    user_id: ObjectId
    bus: int
    train: int
    motorbike: int
    electric_car: int
    gasoline_car: int
    carbon_emissions: int
    date: datetime

    def __init__(self, oid: ObjectId, user_id: ObjectId, bus: int, train: int, motorbike: int,
                 electric_car: int, gasoline_car: int, carbon_emissions: int, date: Union[str, datetime]) -> None:
        super().__init__(oid)
        self.user_id = ObjectId(user_id)
        self.bus = bus
        self.train = train
        self.motorbike = motorbike
        self.electric_car = electric_car
        self.gasoline_car = gasoline_car
        self.carbon_emissions = carbon_emissions
        if isinstance(date, datetime):
            self.date = date
        else:
            self.date = datetime.fromisoformat(date)

    def to_json(self) -> json:
        res = {
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
        return res

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

    @staticmethod
    def get_monthly_view(start: datetime, end: datetime,
                         transportationEntries: list[TransportationEntry]) -> list[dict[str, Union[list[float], str]]]:
        monthly_data = []

        # Make start date offset-aware (assuming UTC for simplicity)
        start = start.replace(tzinfo=timezone.utc)

        current_month = start
        while current_month <= end:
            # Add the current month to the list
            monthly_data.append({
                "month": current_month.strftime("%B"),
                "year": current_month.strftime("%Y"),
                "data": [0, 0, 0, 0]
            })

            # Move to the next month
            if current_month.month == 12:
                current_month = datetime(current_month.year + 1, 1, 1, tzinfo=timezone.utc)
            else:
                current_month = datetime(current_month.year, current_month.month + 1, 1, tzinfo=timezone.utc)

        for transportation_entry in transportationEntries:
            for monthly_entry in monthly_data:
                if transportation_entry.date.strftime("%B") == monthly_entry["month"] \
                        and transportation_entry.date.strftime("%Y") == monthly_entry["year"]:
                    if transportation_entry.date.day < 7:
                        monthly_entry["data"][0] = transportation_entry.calculate_carbon_emissions()
                    elif transportation_entry.date.day < 14:
                        monthly_entry["data"][1] = transportation_entry.calculate_carbon_emissions()
                    elif transportation_entry.date.day < 21:
                        monthly_entry["data"][2] = transportation_entry.calculate_carbon_emissions()
                    elif transportation_entry.date.day < 28:
                        monthly_entry["data"][3] += transportation_entry.calculate_carbon_emissions()
                    else:  # If a Month has 5 sunday, we add them to the fourth week
                        monthly_entry["data"][3] += transportation_entry.calculate_carbon_emissions() / 4

        return monthly_data

    def __repr__(self) -> str:
        return f"Transportation ID: {self.oid.__str__()}"
