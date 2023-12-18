"""
Food Model
"""

from __future__ import annotations
import random
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
        beef_carbon_emissions = self.beef * 9.9
        lamb_carbon_emissions = self.lamb * 3.9
        pork_carbon_emissions = self.pork * 1.2
        chicken_carbon_emissions = self.chicken * 0.98
        fish_carbon_emissions = self.fish * 1.3
        cheese_carbon_emissions = self.cheese * 2.3
        milk_carbon_emissions = self.milk * 0.8
        food_waste_carbon_emissions = self.food_waste * 0.0025
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
        submetric_threshold = 11
        beef_recommendation = "Looking good!"
        lamb_recommendation = "Looking good!"
        pork_recommendation = "Looking good!"
        chicken_recommendation = "Looking good!"
        fish_recommendation = "Looking good!"
        cheese_recommendation = "Looking good!"
        milk_recommendation = "Looking good!"
        food_waste_recommendation = "Looking good!"

        beef_carbon_emissions = food_entry.beef * 9.9
        lamb_carbon_emissions = food_entry.lamb * 3.9
        pork_carbon_emissions = food_entry.pork * 1.2
        chicken_carbon_emissions = food_entry.chicken * 0.98
        fish_carbon_emissions = food_entry.fish * 1.3
        cheese_carbon_emissions = food_entry.cheese * 2.3
        milk_carbon_emissions = food_entry.milk * 0.8
        food_waste_carbon_emissions = food_entry.food_waste * 0.0025

        if beef_carbon_emissions > submetric_threshold:
            recommendation1 = "Try opting for white meat (fish, chicken, etc.)"
            recommendation2 = "Consider alternate forms of protein (chicken, fish, eggs, etc.)"
            recommendation3 = "Try opting for low-impact plant protein sources like peas, legumes and tofu"
            recommendations = [recommendation1, recommendation2, recommendation3]
            beef_recommendation = random.choice(recommendations)

        if lamb_carbon_emissions > submetric_threshold:
            recommendation1 = "Try opting for white meat (fish, chicken, etc.)"
            recommendation2 = "Consider alternate forms of protein (chicken, fish, eggs, etc.)"
            recommendation3 = "Try opting for low-impact plant protein sources like peas, legumes and tofu"
            recommendations = [recommendation1, recommendation2, recommendation3]
            lamb_recommendation = random.choice(recommendations)
        
        if pork_carbon_emissions > submetric_threshold:
            recommendation1 = "Try opting for white meat (fish, chicken, etc.)"
            recommendation2 = "Consider alternate forms of protein (chicken, fish, eggs, etc.)"
            recommendation3 = "Try opting for low-impact plant protein sources like peas, legumes and tofu"
            recommendations = [recommendation1, recommendation2, recommendation3]
            pork_recommendation = random.choice(recommendations)

        if chicken_carbon_emissions > submetric_threshold:
            recommendation1 = "Try opting for low-impact plant protein sources (peas, legumes and tofu)"
            recommendation2 = "Consider alternate forms of protein (eggs, whey, etc.)"
            recommendation3 = "Consider opting for seitan"
            recommendations = [recommendation1, recommendation2, recommendation3]
            chicken_recommendation = random.choice(recommendations)

        if fish_carbon_emissions > submetric_threshold:
            recommendation1 = "Consider alternate forms of protein (chicken, eggs, whey, etc.)"
            recommendation2 = "Try opting for low-impact plant protein sources (peas, legumes and tofu)"
            recommendation3 = ""
            recommendations = [recommendation1, recommendation2, recommendation3]
            fish_recommendation = random.choice(recommendations)

        if cheese_carbon_emissions > submetric_threshold:
            recommendation1 = "Consider alternatives to cheese spreads (hummus, guacamole, etc.)"
            recommendation2 = "Consider plant-based cheeses (made from nuts, soy, or tapioca)"
            recommendation3 = "Consider alternatives to cheese (tofu, tempeh, etc.)"
            recommendations = [recommendation1, recommendation2, recommendation3]
            cheese_recommendation = random.choice(recommendations)

        if milk_carbon_emissions > submetric_threshold:
            recommendation1 = "Consider opting for almond milk"
            recommendation2 = "Consider opting for soy milk"
            recommendation3 = "Consider opting for oat milk"
            recommendations = [recommendation1, recommendation2, recommendation3]
            milk_recommendation = random.choice(recommendations)

        if food_waste_carbon_emissions > submetric_threshold:
            recommendation1 = "Meal planning! Create a realistic shopping list so you only buy what you need"
            recommendation2 = "Carefully assess the expiry date of all food items that you purchase"
            recommendation3 = "First in First out (FIFO)! Use older ingredients first before they expire."
            recommendations = [recommendation1, recommendation2, recommendation3]
            food_waste_recommendation = random.choice(recommendations)
            
        return FoodEntryRecomendation(beef_recommendation, lamb_recommendation, pork_recommendation, chicken_recommendation, 
                                      fish_recommendation, cheese_recommendation, milk_recommendation, food_waste_recommendation)



    def __repr__(self) -> str:
        return f'Food ID: {self.oid.__str__()}'