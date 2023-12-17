"""
All Jobs will be container here
"""
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import ct_confiq

# Jobs
from workers import update_users
ct_confiq.run_carbon_track_configurations()


def print_curr_time():
    # Put your function code here
    print("Running my job at", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))


def start_jobs() -> None:

    # Create an instance of the scheduler
    scheduler = BackgroundScheduler()

    # Add the job to the scheduler
    scheduler.add_job(func=print_curr_time, trigger="interval", seconds=60)
    scheduler.add_job(func=update_users.run_job, trigger="interval", seconds=60)

    # Start the scheduler
    scheduler.start()


if __name__ == '__main__':

    start_jobs()
