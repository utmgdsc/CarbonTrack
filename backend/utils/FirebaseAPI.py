# from typing import Optional
import os
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth

from models.user import User
from mongodb_api.carbon_track_db import CarbonTrackDB

firebase_cert = {
  "type": "service_account",
  "project_id": "carbon-track-system",
  "private_key_id": "54feaa53a4baa9f4642f2fc6195eecb006d02ef4",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxRj9T+A3L5w9p\nnemtNQfWhIuNwt1KkcaqxTZJUUbE8gv31vZQSyOrkf1vRlQ04G9ui4KahNv75g4j\nIjPjAp2zgsQSL3wEyi6LE35OfsrDqOfnCMz2034uBPCN/fH6iz+I0qlHx8KHyqON\nGIeLcR9SHp8JNravU3Hnt2NBrX0xdKMNT3h1b9m+9F5lgIgCa4doRXhBr17WXDQ9\nPicqoXnuQfMO8WCTeP3YEhk2RerfSccQXbJOIjZvmIXCP/rTjFcy5TFuxd+o9nda\n24X79XrTpMPYhe6/qEB/DuzokF9uhS+CCbCjc6Lc3QaXB/WK1/esdx7aPo2E8+/x\nnlmUJDc3AgMBAAECggEADZ/1jBGbldlbcOWnKR3TTWSAiVO5yFpt54AizP3HL6ne\ny5yk78Tmp/Afh2bjX/ED/34PeqrNcY3b9k1RqZfw4PQi97bYlFGpxByqb4QFN4aK\n1FHz1uCoaQcOKgujhnsfVffC9PZgeClV6qlA+bGnE5uw43dmERGbxpBsu4aHAb7x\nMQO2116RHq2zQzJBXJv8Nis2ggueYND9cSoJX0gbDnIZ0XXJwW0L4lCuAVg4OvT9\nCZ3kt/1RtnEZ7gGgZa1QvTF+iK4KtzZNqIZLIefosGXdT0UbNR8P9C6RCJIKyFJ5\nQadY9qInVj6EfJ9FAkTD5Sp2S5uktJ8b8paxTGYReQKBgQDwWpKC05Y5+7eTvoCL\n1zn/Zh0TfxEvudEf/lo/IneYOTCU/1m0QSRUJbwhyvtgzE7PZ7JH2p0DiCxnDAJ7\n71ze9rlHZWunmhUzuykNecs0RAYzLTT9rnXsz1PwxincSCd0oVh+19fs7FYIH0ap\naKLCqyN2nKqLldmo+uNtXmXUzQKBgQC80HmTB5Qse0erwbT9zU3Za6WJ2TplKoBK\nkY5xsppJdjDQYtyuV/tzf/3SUQD3y0G27eUvgGB34lly3uwBIzi/0fAOuPh26hUc\ncoRkES52ufp4N1CcyiGNGuQ+MtAOPIMoZZDj1Rs6uOHugIJYZ9kbFqeYRzzhI5z3\npJ31dIscEwKBgQC6J/xH1acJ27rwdGDNbnIeLLGicw0VoN6m3/J36bMlNE47aJbK\ntJV1kxBmP/d4nmT/4LnFSz3HCYYSfcvCv753djJEaPn7gqyfN3txU36eSX1fz8i2\nHpR5SI8j8edkFIJyo7CN9ZDokJeFjOvGtCMzkSdTa73vhK1jYoYZJD7MlQKBgB+z\nNKYdwJ/TNs48YGG4JVjafNlu8iHoB8/9Lhgir0qkID/sSTawKNRUac30sZ/orSjE\nOhVGjWuzQedKS/9I5Y829QHTxktYs6CqDVYrmExwnv+t8cfRG97v4+AZcdriB/cx\nTikiL0cloTEEvF2RWd71Z7/mPe9ipkjhh2+dWHmnAoGASJlv3GleYwUvm0PZUT2p\ntVhoL7HIfePBucO7MA0769eEwqOaRSi6qxC/KMGqEOfpHMA/lOYi44SFYR/yrZS7\nDx1nPX2WC4AvunpRTWq+HdH/MOpvVqheVmyKAmXZIPdPOD5Ozi52sZH7LaJAMSQy\njCdqusQ64vmDHQsGG9Aob8U=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-jbc6i@carbon-track-system.iam.gserviceaccount.com",
  "client_id": "116415002973239786647",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jbc6i%40carbon-track-system.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

print(firebase_cert)

cred = credentials.Certificate(firebase_cert)
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
