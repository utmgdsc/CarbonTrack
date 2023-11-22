import FLASK_HTTPS from './FLASK_API';
import type ObjectID from 'bson-objectid';
import type { Food } from '../models/Food';

const routeName = '/food';

export const FoodAPI = {
  getFood: async (foodID: ObjectID) => {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/food/' + foodID.str);
      return res.data.food as Food;
    } catch (error) {
      console.error('Error fetching food from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },

  getFoodMetricForToday: async (userID: ObjectID): Promise<undefined | Food> => {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/get_food_metric_for_today/' + userID.str);
      return res.data.food as Food;
    } catch (error) {
      console.error('Error fetching food from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },

  updateFood: async (food: Food): Promise<undefined | Food> => {
    try {
      const res = await FLASK_HTTPS.patch(routeName + '/food/' + food._id.str, {
        food,
      });
      return res.data.food as Food;
    } catch (error) {
      console.error('Error fetching food from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
};
