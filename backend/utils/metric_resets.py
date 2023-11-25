"""
File Description
"""
from datetime import datetime, timedelta


def weekly_metric_reset(d: datetime) -> datetime:
    # Calculate the difference between the current day and the next Sunday (d.weekday() - 6)
    days_until_sunday = (d.weekday() - 6) % 7
    # Subtract the calculated difference from the current date to get the previous Sunday
    previous_sunday = d - timedelta(days=days_until_sunday)
    date = datetime(year=previous_sunday.year, month=previous_sunday.month, day=previous_sunday.day)
    return date
