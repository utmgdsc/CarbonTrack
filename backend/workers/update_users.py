"""
Validate all Logs Job
"""
from bson import ObjectId
import ct_confiq
from mongodb_api.carbon_track_db import CarbonTrackDB
from utils.update_user_level_and_footprint import update_user_level_and_footprint
ct_confiq.run_carbon_track_configurations()


def _update_users() -> None:
    """
    Docstring {"processed": False}
    """
    completed: int = 0
    users: list[dict[str, ObjectId]] = list(CarbonTrackDB.users_coll.find({}, {"_id": 1}))
    if users.__len__() == 0:
        return None
    print("===================================================")
    print("| Running 'update_users'")
    print("===================================================")
    print("| Completed   {completed:<8}/{users.__len__():<8}| {100 * completed / users.__len__()}%")

    for user in users:

        update_user_level_and_footprint(user['_id'])
        completed += 1
        print(f"| Completed   {completed:<8}/{users.__len__():<8}| {100 * completed / users.__len__()}%")

    print("===================================================")


def run_job():
    _update_users()


if __name__ == '__main__':
    _update_users()

