# from typing import Optional
import os
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth

from models.user import User
from mongodb_api.carbon_track_db import CarbonTrackDB

cred = credentials.Certificate("firebase.json")
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
    @staticmethod
    def refresh_token(user_id):
        try:
            user = auth.get_user(user_id)
            new_id_token = user.refresh_id_tokens()
            return new_id_token
        except auth.AuthError as e:
            raise e