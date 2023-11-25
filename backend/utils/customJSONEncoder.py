from datetime import datetime
from bson import ObjectId
import json
from flask.json.provider import JSONProvider


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return obj.__str__()
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


class CustomJSONProvider(JSONProvider):
    def dumps(self, obj, **kwargs):
        return json.dumps(obj, **kwargs, cls=CustomJSONEncoder)

    def loads(self, s: str | bytes, **kwargs):
        return json.loads(s, **kwargs)
