"""
User Model
"""

from __future__ import annotations
import json
from typing import Optional
from models.abstract_db_model import DB_MODEL
from bson import ObjectId
from bson import json_util


class User(DB_MODEL):
    oid: ObjectId
    full_name: str

    def __init__(self, oid: ObjectId, full_name: str) -> None:
        super().__init__(oid)
        self.full_name = str(full_name)

    def to_json(self, for_mongodb: bool = False) -> json:
        res = {
            '_id': self.oid,
            'full_name': self.full_name,
        }
        if for_mongodb:
            return res
        return json.loads(json_util.dumps(res))

    @staticmethod
    def from_json(doc: json) -> User:
        return User(
            oid=ObjectId(doc["_id"]),
            full_name=doc["full_name"],
        )

    def __repr__(self) -> str:
        return f'User ID: {self.oid.__str__()}'
