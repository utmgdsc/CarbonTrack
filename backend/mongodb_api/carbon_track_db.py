# Python Imports
from pymongo.collection import Collection
from pymongo.database import Database

# Imports
from mongodb_api.secrets import get_db


# Get DB From Cluster
carbonTrackDB: Database = get_db("CarbonTrack")


class CarbonTrackDB:
    users_coll: Collection = carbonTrackDB.get_collection("users")
