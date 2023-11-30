import FLASK_HTTPS from './FLASK_API';
import type { FoodEntry, FoodRes } from '../models/Food';
import { type ObjectId } from 'mongodb';

const routeName = '/food';

export const FoodAPI = {

  getFood: async (foodID: ObjectId) => {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/food/' + foodID.toHexString());
      return res.data.food as FoodEntry;
    } catch (error) {
      console.error('Error fetching food from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  getFoodEntriesForUserUsingDataRange: async (start: Date, end: Date) => {
    try {
      const res = await FLASK_HTTPS.post(routeName + '/get_food_entries_for_user_using_data_range', {
        start,
        end
      });
      return res.data as FoodRes;
    } catch (error) {
      console.error('Error fetching food from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  getFoodMetricForToday: async (): Promise<undefined | FoodEntry> => {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/get_food_metric_for_today');
      return res.data.food as FoodEntry;
    } catch (error) {
      console.error('Error fetching food from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  updateFood: async (food: FoodEntry): Promise<undefined | FoodEntry> => {
    try {
      const res = await FLASK_HTTPS.patch(routeName + '/food/' + food._id.toString(), {
        food,
      });
      return res.data.food as FoodEntry;
    } catch (error) {
      console.error('Error fetching food from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  }
}