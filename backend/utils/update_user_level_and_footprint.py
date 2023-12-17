"""
File Description
"""
from datetime import datetime, timedelta

import ct_confiq
from bson import ObjectId

from models.energy import EnergyEntry
from models.food import FoodEntry
from models.user import User
from models.transportation import TransportationEntry
from mongodb_api.carbon_track_db import CarbonTrackDB


def _is_within_one_month(date_object):
    # Get the current date
    current_date = datetime.now()

    # Calculate the difference between the current date and the given date
    difference = current_date - date_object

    # Check if the difference is less than or equal to 30 days
    return difference <= timedelta(days=30)


def _is_within_one_year(date_object):
    # Get the current date
    current_date = datetime.now()

    # Calculate the difference between the current date and the given date
    difference = current_date - date_object

    # Check if the difference is less than or equal to 30 days
    return difference <= timedelta(days=365)


def update_user_level_and_footprint(user_id: ObjectId) -> None:
    """
    Docstring
    """
    weekly_entries_completed: int = 0
    decreased_emissions = 0
    user: User = User.from_json(CarbonTrackDB.users_coll.find_one({'_id': user_id}))

    overall_score = 0
    yearly_score = 0
    monthly_score = 0

    # Get Filtered and Sorted Transportation Entries
    transportation_entries_dicts: list[dict] = list(CarbonTrackDB.transportation_coll.find({'user_id': user.oid}))
    transportation_entries: list[TransportationEntry] = [TransportationEntry.from_json(entry) for entry in transportation_entries_dicts]
    transportation_entries = sorted(transportation_entries, key=lambda entry: entry.date)
    transportation_entries_overall = [entry for entry in transportation_entries
                                      if entry.calculate_carbon_emissions() != 0]
    transportation_entries_yearly = [entry for entry in transportation_entries
                                     if entry.calculate_carbon_emissions() != 0 and _is_within_one_year(entry.date)]
    transportation_entries_monthly = [entry for entry in transportation_entries
                                      if entry.calculate_carbon_emissions() != 0 and _is_within_one_month(entry.date)]
    weekly_entries_completed += transportation_entries_overall.__len__()
    if transportation_entries_overall.__len__() != 0:
        last_entry = transportation_entries_overall[0]
        for entry in transportation_entries_overall[1:]:
            if last_entry.calculate_carbon_emissions() > entry.calculate_carbon_emissions():
                decreased_emissions += 1
                overall_score += 300
            overall_score += 100
            if entry in transportation_entries_yearly:
                if last_entry.calculate_carbon_emissions() > entry.calculate_carbon_emissions():
                    yearly_score += 300
                yearly_score += 100
                if entry in transportation_entries_monthly:
                    if last_entry.calculate_carbon_emissions() > entry.calculate_carbon_emissions():
                        monthly_score += 300
                    monthly_score += 100
            last_entry = entry

    overall_transportation_entries_emissions = sum([entry.calculate_carbon_emissions() for entry in transportation_entries_overall])
    yearly_transportation_entries_emissions = sum([entry.calculate_carbon_emissions() for entry in transportation_entries_yearly])
    monthly_transportation_entries_emissions = sum([entry.calculate_carbon_emissions() for entry in transportation_entries_monthly])

    # Get Filtered and Sorted food Entries
    food_entries_dicts: list[dict] = list(CarbonTrackDB.food_coll.find({'user_id': user.oid}))
    food_entries: list[FoodEntry] = [FoodEntry.from_json(entry) for entry in food_entries_dicts]
    food_entries = sorted(food_entries, key=lambda entry: entry.date)
    food_entries_overall = [entry for entry in food_entries
                            if entry.calculate_carbon_emissions() != 0]
    food_entries_yearly = [entry for entry in food_entries
                           if entry.calculate_carbon_emissions() != 0 and _is_within_one_year(entry.date)]
    food_entries_monthly = [entry for entry in food_entries
                            if entry.calculate_carbon_emissions() != 0 and _is_within_one_month(entry.date)]
    weekly_entries_completed += food_entries_overall.__len__()
    if food_entries_overall.__len__() != 0:
        last_entry = food_entries_overall[0]
        for entry in food_entries_overall[1:]:
            if last_entry.calculate_carbon_emissions() > entry.calculate_carbon_emissions():
                decreased_emissions += 1
                overall_score += 300
            overall_score += 100
            if entry in food_entries_yearly:
                if last_entry.calculate_carbon_emissions() > entry.calculate_carbon_emissions():
                    yearly_score += 300
                yearly_score += 100
                if entry in food_entries_monthly:
                    if last_entry.calculate_carbon_emissions() > entry.calculate_carbon_emissions():
                        monthly_score += 300
                    monthly_score += 100
            last_entry = entry

    overall_food_entries_emissions = sum([entry.calculate_carbon_emissions() for entry in food_entries_overall])
    yearly_food_entries_emissions = sum([entry.calculate_carbon_emissions() for entry in food_entries_yearly])
    monthly_food_entries_emissions = sum([entry.calculate_carbon_emissions() for entry in food_entries_monthly])

    # Get Filtered and Sorted energy Entries
    energy_entries_dicts: list[dict] = list(CarbonTrackDB.energy_coll.find({'user_id': user.oid}))
    energy_entries: list[EnergyEntry] = [EnergyEntry.from_json(entry) for entry in energy_entries_dicts]
    energy_entries = sorted(energy_entries, key=lambda entry: entry.date)
    energy_entries_overall = [entry for entry in energy_entries
                              if entry.calculate_carbon_emissions() != 0]
    energy_entries_yearly = [entry for entry in energy_entries
                             if entry.calculate_carbon_emissions() != 0 and _is_within_one_year(entry.date)]
    energy_entries_monthly = [entry for entry in energy_entries
                              if entry.calculate_carbon_emissions() != 0 and _is_within_one_month(entry.date)]
    weekly_entries_completed += energy_entries_overall.__len__()
    if energy_entries_overall.__len__() != 0:
        last_entry = energy_entries_overall[0]
        for entry in energy_entries_overall[1:]:
            if last_entry.calculate_carbon_emissions() > entry.calculate_carbon_emissions():
                decreased_emissions += 1
                overall_score += 300
            overall_score += 100
            if entry in energy_entries_yearly:
                if last_entry.calculate_carbon_emissions() > entry.calculate_carbon_emissions():
                    yearly_score += 300
                yearly_score += 100
                if entry in energy_entries_monthly:
                    if last_entry.calculate_carbon_emissions() > entry.calculate_carbon_emissions():
                        monthly_score += 300
                    monthly_score += 100
            last_entry = entry

    overall_energy_entries_emissions = sum([entry.calculate_carbon_emissions() for entry in energy_entries_overall])
    yearly_energy_entries_emissions = sum([entry.calculate_carbon_emissions() for entry in energy_entries_yearly])
    monthly_energy_entries_emissions = sum([entry.calculate_carbon_emissions() for entry in energy_entries_monthly])

    # Calculate Badges
    badges = []
    weekly_entries_completed = weekly_entries_completed // 3
    if weekly_entries_completed >= 1:
        badges.append('completed_your_first_weekly_entry!')
    if weekly_entries_completed >= 10:
        badges.append('completed_10_weekly_entries!')
    if weekly_entries_completed >= 50:
        badges.append('completed_50_weekly_entries!')
    if weekly_entries_completed >= 100:
        badges.append('completed_100_weekly_entries!')
    if decreased_emissions > 0:
        badges.append('decreased_emissions_for_first_time!')

    # Combine Emissions
    overall_carbon_emissions = overall_transportation_entries_emissions + overall_food_entries_emissions + overall_energy_entries_emissions
    yearly_carbon_emissions = yearly_transportation_entries_emissions + yearly_food_entries_emissions + yearly_energy_entries_emissions
    monthly_carbon_emissions = monthly_transportation_entries_emissions + monthly_food_entries_emissions + monthly_energy_entries_emissions

    # Update User
    user.overall_emissions = int(overall_carbon_emissions)
    user.yearly_emissions = int(yearly_carbon_emissions)
    user.monthly_emissions = int(monthly_carbon_emissions)
    user.overall_score = overall_score
    user.yearly_score = yearly_score
    user.monthly_score = monthly_score
    user.badges = badges
    CarbonTrackDB.users_coll.update_one(
        {'_id': user.oid},
        {'$set': user.to_json()}
    )
    # user_d = user.to_json()
    # [print(f'{key}: {user_d[key]}') for key in user_d.keys()]


if __name__ == '__main__':

    ct_confiq.run_carbon_track_configurations()
    update_user_level_and_footprint(ObjectId('657f3336869d97c764337f61'))
