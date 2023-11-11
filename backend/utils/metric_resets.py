"""
File Description
"""
from datetime import date, timedelta


def weekly_metric_reset(d: date) -> date:
    # Calculate the difference between the current day and the next Sunday (d.weekday() - 6)
    days_until_sunday = (d.weekday() - 6) % 7
    # Subtract the calculated difference from the current date to get the previous Sunday
    previous_sunday = d - timedelta(days=days_until_sunday)
    return previous_sunday


if __name__ == '__main__':

    print(weekly_metric_reset(date(year=2023, month=11, day=5)))
    print(weekly_metric_reset(date(year=2023, month=11, day=9)))
    print(weekly_metric_reset(date(year=2023, month=11, day=11)))
    print(weekly_metric_reset(date(year=2023, month=11, day=12)))
    print(weekly_metric_reset(date(year=2023, month=11, day=13)))
