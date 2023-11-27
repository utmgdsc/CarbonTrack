import type ObjectID from 'bson-objectid';

export interface Energy {
  _id: ObjectID;
  user_id: ObjectID;
  heating_oil: number;
  natural_gas: number;
  electricity: number;
  province: string;
  household: number;
  carbon_emissions: number;
  date: Date;
}
