# Python Imports
from flask import Flask, Response, jsonify, render_template
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from routes.ct_firebase_service import ct_firebase_service
# Imports
from routes.users import users
from routes.transportation import transportation_service
from utils.customJSONEncoder import CustomJSONProvider
from routes.food import food_service
from routes.energy import energy_service


app = Flask(__name__)
app.json = CustomJSONProvider(app)

# Services
app.register_blueprint(users, url_prefix="/users")
app.register_blueprint(transportation_service, url_prefix="/transportation")
app.register_blueprint(food_service, url_prefix="/food")
app.register_blueprint(energy_service, url_prefix="/energy")
app.register_blueprint(ct_firebase_service, url_prefix="/f")
CORS(app)


@app.route("/")
def home() -> Response:
    return jsonify('Carbon Track APP BACKEND API :: UNAUTHORIZED ACCESS')


# Error handler for 400 Bad Request errors
@app.errorhandler(400)
def bad_request(error: HTTPException):
    response = jsonify({"error": "Bad Request", "message": error.description})
    response.status_code = error.code
    return response


# Error handler for 404 Not Found errors
@app.errorhandler(404)
def not_found(error: HTTPException):
    response = jsonify({"error": error.name, "message": error.description})
    response.status_code = error.code
    return response


if __name__ == '__main__':

    app.run(host='0.0.0.0', port=6050, debug=True, threaded=False)
