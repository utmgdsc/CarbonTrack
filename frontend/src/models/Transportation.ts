import type ObjectID from "bson-objectid";


export interface User {
    _id: ObjectID
    full_name: string
    email: string
    badges: string[]
    friends: ObjectID[]
    score: number
}