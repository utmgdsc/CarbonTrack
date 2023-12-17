"""
Food Model
"""

from __future__ import annotations
from typing import Union
import json
from datetime import datetime
from models.abstract_carbon_model import CARBON_MODEL
from bson import ObjectId


class FoodEntry(CARBON_MODEL):
    oid: ObjectId
    user_id: ObjectId
    carbon_emissions: int
    date: datetime
    beef: int
    lamb: int
    pork: int
    chicken: int
    fish: int
    cheese: int
    milk: int
    food_waste: int
    metric_threshold = 200/3

    # food measurements in # of 100g servings
    def __init__(self, oid: ObjectId, user_id: ObjectId, carbon_emissions: int, date: Union[str, datetime],
                 beef: int, lamb: int, pork: int, chicken: int, fish: int, cheese: int, milk: int,
                 food_waste: int) -> None:
        super().__init__(oid, user_id, carbon_emissions, date)
        self.beef = beef
        self.lamb = lamb
        self.pork = pork
        self.chicken = chicken
        self.fish = fish
        self.cheese = cheese
        self.milk = milk
        self.food_waste = food_waste

    def to_json(self) -> json:
        return {
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


class FoodEntryRecomendation(CARBON_MODEL):
    beef_recommendation: str
    lamb_recommendation: str
    pork_recommendation: str
    chicken_recommendation: str
    fish_recommendation: str
    cheese_recommendation: str
    milk_recommendation: str
    food_waste_recommendation: str

    # food measurements in # of 100g servings
    def __init__(self, beef_recommendation: str, lamb_recommendation: str, pork_recommendation: str, chicken_recommendation: str, 
                 fish_recommendation: str, cheese_recommendation: str, milk_recommendation: str,
                 food_waste_recommendation: str) -> None:
        self.beef_recommendation = beef_recommendation
        self.lamb_recommendation = lamb_recommendation
        self.pork_recommendation = pork_recommendation
        self.chicken_recommendation = chicken_recommendation
        self.fish_recommendation = fish_recommendation
        self.cheese_recommendation = cheese_recommendation
        self.milk_recommendation = milk_recommendation
        self.food_waste_recommendation = food_waste_recommendation

    def to_json(self) -> json:
        return {
            'beef_recommendation': self.beef_recommendation,
            'lamb_recommendation': self.lamb_recommendation,
            'pork_recommendation': self.pork_recommendation,
            'chicken_recommendation': self.chicken_recommendation,
            'fish_recommendation': self.fish_recommendation,
            'cheese_recommendation': self.cheese_recommendation,
            'milk_recommendation': self.milk_recommendation,
            'food_waste_recommendation': self.food_waste_recommendation,
        }

    @staticmethod
    def from_json(doc: json) -> FoodEntry:
        return FoodEntry(
            beef_recommendation=doc['beef_recommendation'],
            lamb_recommendation=doc['lamb_recommendation'],
            pork_recommendation=doc['pork_recommendation'],
            chicken_recommendation=doc['chicken_recommendation'],
            fish_recommendation=doc['fish_recommendation'],
            cheese_recommendation=doc['cheese_recommendation'],
            milk_recommendation=doc['milk_recommendation'],
            food_waste_recommendation=doc['food_waste_recommendation']
        )
    

    @staticmethod
    def from_food_entry(food_entry: FoodEntry) -> FoodEntryRecomendation:
        submetric_threshold = FoodEntry.metric_threshold/8
        beef_recommendation = "Beef emissions look good!"
        lamb_recommendation = "Lamb emissions look good!"
        pork_recommendation = "Pork emissions look good!"
        chicken_recommendation = "Chicken emissions look good!"
        fish_recommendation = "Fish emissions look good!"
        cheese_recommendation = "Cheese emissions look good!"
        milk_recommendation = "Milk emissions look good!"
        food_waste_recommendation = "Food waste emissions look good!"

        beef_carbon_emissions = food_entry.beef * 15.5
        lamb_carbon_emissions = food_entry.lamb * 5.84
        pork_carbon_emissions = food_entry.pork * 2.4
        chicken_carbon_emissions = food_entry.chicken * 1.8
        fish_carbon_emissions = food_entry.fish * 1.8
        cheese_carbon_emissions = food_entry.cheese * 2.79
        milk_carbon_emissions = food_entry.milk * 0.8
        food_waste_carbon_emissions = food_entry.food_waste * 0.25

        if beef_carbon_emissions > submetric_threshold:
            beef_recommendation = "Beef emissions too high"

        if lamb_carbon_emissions > submetric_threshold:
            lamb_recommendation = "Lamb emissions too high"
        
        if pork_carbon_emissions > submetric_threshold:
            pork_recommendation = "Pork emissions too high"

        if chicken_carbon_emissions > submetric_threshold:
            chicken_recommendation = "Chicken emissions too high"

        if fish_carbon_emissions > submetric_threshold:
            fish_recommendation = "Fish emissions too high"

        if cheese_carbon_emissions > submetric_threshold:
            cheese_recommendation = "Cheese emissions too high"

        if milk_carbon_emissions > submetric_threshold:
            milk_recommendation = "Milk emissions too high"

        if food_waste_carbon_emissions > submetric_threshold:
            food_waste_recommendation = "Food waste emissions too high"
            
        return FoodEntryRecomendation(beef_recommendation, lamb_recommendation, pork_recommendation, chicken_recommendation, 
                                      fish_recommendation, cheese_recommendation, milk_recommendation, food_waste_recommendation)



    def __repr__(self) -> str:
        return f'Food ID: {self.oid.__str__()}'