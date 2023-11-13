from typing import Optional
from pprint import pprint
import firebase_admin
from firebase_admin import credentials


cred = credentials.Certificate("firebase.json")
APP = firebase_admin.initialize_app(cred)


class FirebaseAPI:
    @staticmethod
    def verify_google_token(id_token: str) -> Optional[dict]:
        return firebase_admin.auth.verify_id_token(
            id_token=id_token, check_revoked=True
        )


if __name__ == "__main__":
    d = FirebaseAPI.verify_google_token(
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBkMGU4NmJkNjQ3NDBjYWQyNDc1NjI4ZGEyZWM0OTZkZjUyYWRiNWQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiWWF6YW4gQXJtb3VzaCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKMThLbUhSTDY3d2NHNDZLNDhaVF9RN0RVbExyN25rOHhJQ2s1S0VNZExVRW9xPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2NhcmJvbi10cmFjay1zeXN0ZW0iLCJhdWQiOiJjYXJib24tdHJhY2stc3lzdGVtIiwiYXV0aF90aW1lIjoxNjk4NTE3OTkzLCJ1c2VyX2lkIjoiUkZSbmdJVm1Bd1BHY0pxVFVPalZOeFB4SzVzMSIsInN1YiI6IlJGUm5nSVZtQXdQR2NKcVRVT2pWTnhQeEs1czEiLCJpYXQiOjE2OTg1MTc5OTMsImV4cCI6MTY5ODUyMTU5MywiZW1haWwiOiJ5YXphbi5hcm1vdXNoMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNzEyOTg2MDYwMzg2MDUxODQwOCJdLCJlbWFpbCI6WyJ5YXphbi5hcm1vdXNoMUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.Q1b4XkYwuMzn1aGv3qHVu469hGrgUI8FMSrsru_CgVGxhBKTKsUaKExwRssakLEwcQ0u68OcmNQjBLbwP2SE99f61R0GQxuiyI5m5L1-OhTrbPRYcRYDEFBySmSQMgOFBmPik5JlMcWOz1LtLXzbnCR-epcSrxs8qUZ2_rfpeYaaJavRQuYBJmQo8FgJyPz-LQ2aa-2ileNipyyg7AXxqU0fgnTLSSvHzPqk6O-bSCci53QdY2w6n2vusEUpIea6i5XhIrfr0BkMXy8VIoJQ8RoIjdS-_CpTx-1aixDzOMQd-I-synRJN7-YZKV5E4yupIquNPjQmFFoGF5xGTEelA"
    )
    pprint(d)
