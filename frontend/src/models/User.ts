import { type ObjectId } from "mongodb";


export interface User {
    _id: ObjectId
    full_name: string
    email: string
    badges: string[]
    friends: ObjectId[]
    score: number
}


export function getUserLevel(user: User): number {
    if (user.score < 250) {
        return 1;
    } else if (user.score < 500) {
        return 2;
    } else if (user.score < 1000) {
        return 3;
    } else if (user.score < 2000) {
        return 4;
    } else if (user.score < 4000) {
        return 5;
    } else if (user.score < 8000) {
        return 6;
    } else if (user.score < 16000) {
        return 7;
    } else if (user.score < 32000) {
        return 8;
    } else if (user.score < 64000) {
        return 9;
    } else {
      return 10;
    }
  }