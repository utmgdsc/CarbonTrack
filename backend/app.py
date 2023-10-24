# Python Imports
from flask import Flask
from flask_cors import CORS

# Imports
from routes.users import users
# from routes.carbon_auth import carbon_auth
from logging import FileHandler,WARNING

app = Flask(__name__)

# Services
app.register_blueprint(users, url_prefix="/users")
# app.register_blueprint(carbon_auth, url_prefix="/carbon_auth")
CORS(app)


@app.route("/")
def home() -> str:
    return 'Carbon Track APP BACKEND API :: UNAUTHORIZED ACCESS'


if __name__ == '__main__':

    app.run(host='0.0.0.0', port=6050, debug=True)
