"""
Carbon Model

All classes that store carbon usage must inherit from this abstract class
"""
from __future__ import annotations
import json
from datetime import datetime, timezone
from typing import Union

from bson import ObjectId
from models.abstract_db_model import DB_MODEL


class CARBON_MODEL(DB_MODEL):

    oid: ObjectId
    user_id: ObjectId
    carbon_emissions: int
    date: datetime

    def __init__(self, oid: ObjectId, user_id: ObjectId, carbon_emissions: int, date: Union[str, datetime]) -> None:
        super().__init__(oid)
        self.user_id = ObjectId(user_id)
        self.carbon_emissions = carbon_emissions
        if isinstance(date, datetime):
            self.date = date
        else:
            self.date = datetime.fromisoformat(date)

    def to_json(self) -> json:
        raise NotImplementedError

    @staticmethod
    def from_json(doc: json) -> CARBON_MODEL:
        raise NotImplementedError

    def calculate_carbon_emissions(self) -> int:
        raise NotImplementedError

    @staticmethod
    def get_monthly_view(start: datetime, end: datetime,
                         carbonEntries: list[CARBON_MODEL]) -> list[dict[str, Union[list[float], str]]]:
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

        for carbon_entry in carbonEntries:
            for monthly_entry in monthly_data:
                if carbon_entry.date.strftime("%B") == monthly_entry["month"] \
                        and carbon_entry.date.strftime("%Y") == monthly_entry["year"]:
                    if carbon_entry.date.day < 7:
                        monthly_entry["data"][0] = carbon_entry.calculate_carbon_emissions()
                    elif carbon_entry.date.day < 14:
                        monthly_entry["data"][1] = carbon_entry.calculate_carbon_emissions()
                    elif carbon_entry.date.day < 21:
                        monthly_entry["data"][2] = carbon_entry.calculate_carbon_emissions()
                    elif carbon_entry.date.day < 28:
                        monthly_entry["data"][3] += carbon_entry.calculate_carbon_emissions()
                    else:  # If a Month has 5 sunday, we add them to the fourth week
                        monthly_entry["data"][3] += carbon_entry.calculate_carbon_emissions() / 4
        return monthly_data

    def __repr__(self) -> str:
        raise NotImplementedError
