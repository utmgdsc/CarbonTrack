import type ObjectID from 'bson-objectid';

export interface Food {
  _id: ObjectID
  user_id: ObjectID
  carbon_emissions: number
  date: Date
  beef: number
  lamb: number
  pork: number
  chicken: number
  fish: number
  cheese: number
  milk: number
  food_waste: number
}
