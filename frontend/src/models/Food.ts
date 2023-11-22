import type ObjectID from 'bson-objectid';

export interface Food {
  _id: ObjectID;
  user_id: ObjectID;
  beef: number;
  lamb: number;
  pork: number;
  chicken: number;
  fish: number;
  cheese: number;
  milk: number;
  food_waste: number;
  carbon_emissions: number;
  date: Date;
}
