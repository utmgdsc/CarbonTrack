# Python Imports
from flask import Flask, render_template
from flask_cors import CORS
from flask_login import LoginManager

# Imports
from routes.users import users
from routes.transportation import transportation_service


app = Flask(__name__)

# Services
app.register_blueprint(users, url_prefix="/users")
app.register_blueprint(transportation_service, url_prefix="/transportation")
CORS(app)


@app.route("/")
def home() -> str:
    return 'Carbon Track APP BACKEND API :: UNAUTHORIZED ACCESS'


# This is just for testing
@app.route("/google")
def test_google() -> str:
    return render_template('index.html')


if __name__ == '__main__':

    app.run(host='0.0.0.0', port=6050, debug=True)
