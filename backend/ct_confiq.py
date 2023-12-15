"""
File Description
"""
import json
import os


def _load_secrets() -> None:
    if os.environ.get('DB_URI') is None:
        with open('secrets.json') as secret_json:
            secrets = json.load(secret_json)
            for key, value in secrets.items():
                os.environ[key] = value


def run_carbon_track_configurations() -> None:
    _load_secrets()


run_carbon_track_configurations()
