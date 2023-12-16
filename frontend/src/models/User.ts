import { type ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  uid: string;
  full_name: string;
  email: string;
  badges: string[];
  friends: ObjectId[];
  monthly_score: number;
  yearly_score: number;
  overall_score: number;
  province: string;
  household: number;
  fuel_efficiency: number;
  photoURL: string;
}

export interface RankUser {
  rank: number;
  name: string;
  footprint: number;
  score: number;
}

export interface TopUsersLists {
  top_monthly_users: RankUser[];
  top_yearly_users: RankUser[];
  top_overall_users: RankUser[];
}

export function getUserLevel(score: number): number {
  if (score < 250) {
    return 1;
  } else if (score < 500) {
    return 2;
  } else if (score < 1000) {
    return 3;
  } else if (score < 2000) {
    return 4;
  } else if (score < 4000) {
    return 5;
  } else if (score < 8000) {
    return 6;
  } else if (score < 16000) {
    return 7;
  } else if (score < 32000) {
    return 8;
  } else if (score < 64000) {
    return 9;
  } else {
    return 10;
  }
}
