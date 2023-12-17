"""
File Description
"""
import ct_confiq
from bson import ObjectId
from models.user import User
from mongodb_api.carbon_track_db import CarbonTrackDB


def update_user_level_and_footprint(user_id: ObjectId) -> None:
    """
    Docstring
    """
    user = User.from_json(CarbonTrackDB.users_coll.find_one({'_id': user_id}))
    print(user.full_name)


if __name__ == '__main__':

    ct_confiq.run_carbon_track_configurations()
    update_user_level_and_footprint(ObjectId('657f3336869d97c764337f61'))
