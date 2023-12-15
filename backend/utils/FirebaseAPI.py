# from typing import Optional
import os
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth

from models.user import User
from mongodb_api.carbon_track_db import CarbonTrackDB

cred = credentials.Certificate(dict(os.environ))
APP = firebase_admin.initialize_app(cred)


class FirebaseAPI:
    @staticmethod
    def verify_google_token(id_token: str) -> Optional[dict]:
        return auth.verify_id_token(
            id_token=id_token, check_revoked=True
        )

    @staticmethod
    def get_user(id_token: str) -> Optional[User]:
        user = auth.verify_id_token(id_token=id_token, check_revoked=True)
        if user:
            query = {"email": user.get('email')}
            item = CarbonTrackDB.users_coll.find_one(query)
            item = User.from_json(item)
            return item
