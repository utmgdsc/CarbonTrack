import type ObjectID from "bson-objectid";


export interface TransportationEntry {
    _id: string
    user_id: ObjectID
    bus: number
    train: number
    motorbike: number
    electric_car: number
    gasoline_car: number
    carbon_emissions: number
    date: Date
}

export interface MonthlyEntry {
    'data': number[]
    'month': string
    'year': string
}

export interface TransportationRes {
    transportationEntries: TransportationEntry[]
    monthlyData: MonthlyEntry[]
}