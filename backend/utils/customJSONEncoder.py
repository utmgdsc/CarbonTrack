from datetime import datetime
from bson import ObjectId
import json
from flask.json.provider import JSONProvider

from models.abstract_db_model import DB_MODEL


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return obj.__str__()
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, DB_MODEL):
            return obj.to_json()
        return super().default(obj)


class CustomJSONProvider(JSONProvider):
    def dumps(self, obj, **kwargs):
        return json.dumps(obj, **kwargs, cls=CustomJSONEncoder)

    def loads(self, s: str | bytes, **kwargs):
        return json.loads(s, **kwargs)
