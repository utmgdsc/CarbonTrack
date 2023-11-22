import type ObjectID from "bson-objectid";


export interface Transportation {
    _id: ObjectID
    user_id: ObjectID
    bus: number
    train: number
    motorbike: number
    electric_car: number
    gasoline_car: number
    carbon_emmisions: number
    date: Date
}

export interface MonthlyEntry {
    'data': number[]
    'month': string
    'year': string
}

export interface TransportationRes {
    transportationEntries: []
    monthlyData: []
}