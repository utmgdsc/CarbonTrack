"""
DB Model

All class that are storable in the db must inherit from this abstract class
"""
from __future__ import annotations
from bson import ObjectId


class DB_MODEL:

    oid: ObjectId

    def __init__(self, oid: ObjectId) -> None:
        self.oid = ObjectId(oid)

    def to_json(self) -> dict:
        raise NotImplementedError

    @staticmethod
    def from_json(doc: dict) -> DB_MODEL:
        raise NotImplementedError

    def __repr__(self) -> str:
        raise NotImplementedError
