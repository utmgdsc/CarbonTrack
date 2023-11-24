from typing import Optional
from pprint import pprint
import firebase_admin
from firebase_admin import credentials, auth
from models.user import User
from mongodb_api.carbon_track_db import CarbonTrackDB

cred = credentials.Certificate("firebase.json")
APP = firebase_admin.initialize_app(cred)


class FirebaseAPI:
    @staticmethod
    def verify_google_token(id_token: str) -> Optional[dict]:
        # print(id_token)
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


if __name__ == "__main__":
    d = FirebaseAPI.verify_google_token(
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE2YzYzNTNmMmEzZWMxMjg2NTA1MzBkMTVmNmM0Y2Y0NTcxYTQ1NTciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2FyYm9uLXRyYWNrLXN5c3RlbSIsImF1ZCI6ImNhcmJvbi10cmFjay1zeXN0ZW0iLCJhdXRoX3RpbWUiOjE3MDA2NzU5NzksInVzZXJfaWQiOiJ3UFVEaEFiM0Q5ZHpoeDJXa1RBZlBLbnhGSG0xIiwic3ViIjoid1BVRGhBYjNEOWR6aHgyV2tUQWZQS254RkhtMSIsImlhdCI6MTcwMDY3NTk3OSwiZXhwIjoxNzAwNjc5NTc5LCJlbWFpbCI6InlhemFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ5YXphbkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.MRTtHwIK-sShrOUSOTq0yJvjj2svkH3X5T2Zb2hP-KzUYxXLWTRDVUtbBxCJMghqCccTm0jYVNEEd-9i4KteCbJmSLDNbqXR0qO2797fsyo0LU9YpjRyk6-NV6CpHSSMIXeuOcdgXCo65yh_aVlS-tZJg5QU5Av0RtCxHG2szIAz-gqQMuwMxi5iHSCRns67NrxrTdO-BT_lazZo5L3huiyDnE-AGGgprQQcL1I4DMRYRwkEwDLrXoM6GNIylIur0rlVWQxUlOQvUEDhOW8YenpwPm0xuVe78yWxPMFj4aMwgoe6DotMW-HfGv5jSz6baZSHg0yfsEwbtH-iUL88uQ"
    )
    pprint(d)
