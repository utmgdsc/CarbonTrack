import { type ObjectId } from "mongodb"

export interface EnergyEntry {
  _id: ObjectId
  user_id: ObjectId
  carbon_emissions: number
  date: Date
  heating_oil: number
  natural_gas: number
  electricity: number
  province: string
  household: number
}

export interface MonthlyEntry {
    'data': number[]
    'month': string
    'year': string
}

export interface EnergyRes {
    energyEntries: EnergyEntry[]
    monthlyData: MonthlyEntry[]
}
