"""
Food Model
"""

from __future__ import annotations
import json
from datetime import datetime
from models.abstract_db_model import DB_MODEL
from bson import ObjectId
from bson import json_util


class FoodEntry(DB_MODEL):
    oid: ObjectId
    user_id: ObjectId
    beef: int
    lamb: int
    pork: int
    chicken: int
    fish: int
    cheese: int
    milk: int
    food_waste: int
    carbon_emissions: float
    date: datetime

    # food measurements in # of 100g servings
    def __init__(self, oid: ObjectId, user_id: ObjectId, beef: int, lamb: int, pork: int,
                 chicken: int, fish: int, cheese: int, milk: int, food_waste: int, carbon_emissions: float,
                 date: datetime) -> None:
        super().__init__(oid)
        self.user_id = ObjectId(user_id)
        self.beef = beef
        self.lamb = lamb
        self.pork = pork
        self.chicken = chicken
        self.fish = fish
        self.cheese = cheese
        self.milk = milk
        self.food_waste = food_waste
        self.carbon_emissions = carbon_emissions
        self.date = date

    def to_json(self, for_mongodb: bool = False) -> json:
        res = {
            '_id': self.oid,
            'user_id': self.user_id,
            'beef': self.beef,
            'lamb': self.lamb,
            'pork': self.pork,
            'chicken': self.chicken, 
            'fish': self.fish,
            'cheese': self.cheese, 
            'milk': self.milk,
            'food_waste': self.food_waste, 
            'carbon_emissions': self.calculate_carbon_emissions(),
            'date': self.date
        }
        if for_mongodb:
            return res
        return json.loads(json_util.dumps(res))

    @staticmethod
    def from_json(doc: json) -> FoodEntry:
        return FoodEntry(
            oid=ObjectId(doc["_id"]),
            user_id=doc['user_id'],
            beef=doc['beef'],
            lamb=doc['lamb'],
            pork=doc['pork'],
            chicken=doc['chicken'],
            fish=doc['fish'],
            cheese=doc['cheese'],
            milk=doc['milk'],
            food_waste=doc['food_waste'],
            carbon_emissions=doc["carbon_emissions"],
            date=doc["date"]
        )

    def calculate_carbon_emissions(self) -> float:
        beef_carbon_emissions = self.beef * 15.5
        lamb_carbon_emissions = self.lamb * 5.84
        pork_carbon_emissions = self.pork * 2.4
        chicken_carbon_emissions = self.chicken * 1.8
        fish_carbon_emissions = self.fish * 1.8
        cheese_carbon_emissions = self.cheese * 2.79
        milk_carbon_emissions = self.milk * 0.8
        food_waste_carbon_emissions = self.food_waste * 0.25
        return sum([beef_carbon_emissions, lamb_carbon_emissions, pork_carbon_emissions,
                    chicken_carbon_emissions, fish_carbon_emissions, cheese_carbon_emissions, 
                    milk_carbon_emissions, food_waste_carbon_emissions])

    def __repr__(self) -> str:
        return f'Food ID: {self.oid.__str__()}'
