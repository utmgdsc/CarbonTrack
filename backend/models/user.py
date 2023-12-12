"""
User Model
"""

from __future__ import annotations
import json
from models.abstract_db_model import DB_MODEL
from bson import ObjectId


class User(DB_MODEL):
    oid: ObjectId
    full_name: str
    email: str
    badges: list[str]
    friends: list[str]
    score: int
    province: str
    household: int
    fuel_efficiency: float

    def __init__(
        self,
        oid: ObjectId,
        full_name: str,
        email: str,
        uid: str,
        badges: list[str],
        friends: list[str],
        score: int,
        province: str,
        household: int,
        fuel_efficiency: float,
    ) -> None:
        super().__init__(oid)
        self.full_name = str(full_name)
        self.email = str(email)
        self.uid = uid
        self.badges = badges
        self.friends = friends
        self.score = score
        self.province = province
        self.household = household
        self.fuel_efficiency = fuel_efficiency

    def to_json(self) -> json:
        return {
            "_id": self.oid,
            "full_name": self.full_name,
            "email": self.email,
            "uid": self.uid,
            "badges": self.badges,
            "friends": self.friends,
            "score": self.score,
            "province": self.province,
            "household": self.household,
            "fuel_efficiency": self.fuel_efficiency,
        }

    @staticmethod
    def from_json(doc: json) -> User:
        return User(
            oid=ObjectId(doc["_id"]),
            full_name=doc["full_name"],
            email=doc["email"],
            uid=doc["uid"],
            badges=doc["badges"],
            friends=doc["friends"],
            score=doc["score"],
            province=doc["province"],
            household=doc["household"],
            fuel_efficiency=doc["fuel_efficiency"],
        )

    def __repr__(self) -> str:
        return f"User ID: {self.oid.__str__()}"
