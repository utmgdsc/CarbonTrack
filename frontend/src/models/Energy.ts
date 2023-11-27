import type ObjectID from 'bson-objectid';

export interface EnergyEntry {
  _id: ObjectID
  user_id: ObjectID
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
