import { type ObjectId } from 'mongodb';

export interface FoodEntry {
  _id: ObjectId;
  user_id: ObjectId;
  carbon_emissions: number;
  date: Date;
  beef: number;
  lamb: number;
  pork: number;
  chicken: number;
  fish: number;
  cheese: number;
  milk: number;
  food_waste: number;
}

export interface MonthlyEntry {
  data: number[];
  month: string;
  year: string;
}

export interface FoodRes {
  foodEntries: FoodEntry[];
  monthlyData: MonthlyEntry[];
}

export interface FoodEntryRecommendation {
  beef_recommendation: string;
  lamb_recommendation: string;
  pork_recommendation: string;
  chicken_recommendation: string;
  fish_recommendation: string;
  cheese_recommendation: string;
  milk_recommendation: string;
  food_waste_recommendation: string;
}
