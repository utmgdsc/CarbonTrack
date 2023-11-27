import { type ObjectId } from "mongodb";


export interface TransportationEntry {
    _id: ObjectId
    user_id: ObjectId
    carbon_emissions: number
    date: Date
    bus: number
    train: number
    motorbike: number
    electric_car: number
    gasoline_car: number
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