# Python Imports
from bson import ObjectId
from flask import Flask, Response, jsonify, render_template
from flask_cors import CORS

# Imports
from routes.users import users
from routes.transportation import transportation_service
from utils.customJSONEncoder import CustomJSONProvider

app = Flask(__name__)
app.json = CustomJSONProvider(app)

# Services
app.register_blueprint(users, url_prefix="/users")
app.register_blueprint(transportation_service, url_prefix="/transportation")
CORS(app)


@app.route("/")
def home() -> Response:
    return jsonify('Carbon Track APP BACKEND API :: UNAUTHORIZED ACCESS')


# This is just for testing
@app.route("/google")
def test_google() -> str:
    return render_template('index.html')


@app.route('/get_object_id')
def get_object_id():
    # Example: Creating an ObjectId
    my_object_id = ObjectId()

    return jsonify({'_id': my_object_id})


if __name__ == '__main__':

    app.run(host='0.0.0.0', port=6050, debug=True, threaded=False)
