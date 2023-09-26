"""
User Model
"""

from __future__ import annotations
from typing import Optional
from models.abstract_db_model import DB_MODEL
from bson import ObjectId


class User(DB_MODEL):
    oid: ObjectId
    full_name: str

    def __init__(self, oid: ObjectId, full_name: str) -> None:
        super().__init__(oid)
        self.full_name = str(full_name)

    def to_json(self) -> dict:
        return {
            '_id': self.oid,
            'full_name': self.full_name,
        }

    @staticmethod
    def from_json(doc: dict) -> User:
        return User(
            oid=ObjectId(doc["_id"]),
            full_name=doc["full_name"],
        )

    def __repr__(self) -> str:
        return f'User ID: {self.oid.__str__()}'
