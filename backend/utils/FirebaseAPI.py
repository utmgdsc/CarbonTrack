from typing import Optional
from pprint import pprint
import firebase_admin
from firebase_admin import credentials, auth
from firebase_admin.auth import UserRecord

from models.user import User
from mongodb_api.carbon_track_db import CarbonTrackDB

cred = credentials.Certificate("firebase.json")
APP = firebase_admin.initialize_app(cred)


class FirebaseAPI:
    @staticmethod
    def verify_google_token(id_token: str) -> Optional[dict]:
        # print("Yazan")
        # print(id_token)
        id_token="eyJhbGciOiJSUzI1NiIsImtpZCI6IjBiYmQyOTllODU2MmU3MmYyZThkN2YwMTliYTdiZjAxMWFlZjU1Y2EiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2FyYm9uLXRyYWNrLXN5c3RlbSIsImF1ZCI6ImNhcmJvbi10cmFjay1zeXN0ZW0iLCJhdXRoX3RpbWUiOjE3MDExMjc0NTAsInVzZXJfaWQiOiJ3UFVEaEFiM0Q5ZHpoeDJXa1RBZlBLbnhGSG0xIiwic3ViIjoid1BVRGhBYjNEOWR6aHgyV2tUQWZQS254RkhtMSIsImlhdCI6MTcwMTEyNzQ1MCwiZXhwIjoxNzAxMTMxMDUwLCJlbWFpbCI6InlhemFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ5YXphbkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.YcyzOeOgXiurm2W8lw2YwvIL2Pfweezu2ASK_RK3MuVRUw2Z1AXwWTJyDbjioYfaXS2GwurtJ3u-q7TqPlL4MmTwb5G09F7cmbNBvbEBQTtOhK9TmyNlMcGV0Gtkaf3J7xebL4qcwQ9aI_lZ1MGS9tMYn8gwArxIVs8nNPxkSFUicrj_buf3Jan6kNMfVIQOOUg9cqocn3VoxInAI9fjbxyliZ7LDF3rNBzBNsXQoOJ6UlHqEcd_Up2oLGsEm3HnIArtPzn4V_BNcmkaZh2cx28KDUjUPpTVHdWguEPUkA_CFhDTYdts7ReisAQviKTkhIxDkCGsUtllWU0Q4fTNcg"
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
