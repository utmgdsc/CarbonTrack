import type ObjectID from "bson-objectid";


export interface Transportation {
    _id: ObjectID
    user_id: ObjectID
    bus: number
    train: number
    motorbike: number
    plane: number
    electric_car: number
    gasoline_car: number
    carbon_emmisions: number
    date: Date
}