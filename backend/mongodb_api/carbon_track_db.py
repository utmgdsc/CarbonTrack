# Python Imports
import os
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database


# Get DB From Cluster
_cluster: MongoClient = MongoClient(os.environ.get("DB_URI"))
carbonTrackDB: Database = _cluster["CarbonTrack"]


class CarbonTrackDB:
    users_coll: Collection = carbonTrackDB.get_collection("users")
    transportation_coll: Collection = carbonTrackDB.get_collection("transportation")
    food_coll: Collection = carbonTrackDB.get_collection("food")
    energy_coll: Collection = carbonTrackDB.get_collection("energy")
