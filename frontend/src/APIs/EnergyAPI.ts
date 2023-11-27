import FLASK_HTTPS from './FLASK_API';
import type { EnergyEntry, EnergyRes } from '../models/Energy';
import { type ObjectId } from 'mongodb';

const routeName = '/energy';

export const EnergyAPI = {

  getEnergy: async (energyID: ObjectId) => {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/energy/' + energyID.toHexString());
      return res.data.energy as EnergyEntry;
    } catch (error) {
      console.error('Error fetching energy from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  getEnergyEntriesForUserUsingDataRange: async (start: Date, end: Date) => {
    try {
      const res = await FLASK_HTTPS.post(routeName + '/get_energy_entries_for_user_using_data_range', {
        start,
        end
      });
      return res.data as EnergyRes;
    } catch (error) {
      console.error('Error fetching energy from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  getEnergyMetricForToday: async (): Promise<undefined | EnergyEntry> => {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/get_energy_metric_for_today');
      return res.data.energy as EnergyEntry;
    } catch (error) {
      console.error('Error fetching energy from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  updateEnergy: async (energy: EnergyEntry): Promise<undefined | EnergyEntry> => {
    try {
      const res = await FLASK_HTTPS.patch(routeName + '/energy/' + energy._id.toString(), {
        energy,
      });
      return res.data.energy as EnergyEntry;
    } catch (error) {
      console.error('Error fetching energy from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  }
}