import FLASK_HTTPS from './FLASK_API';
import type ObjectID from 'bson-objectid';
import type { Energy } from '../models/Energy';

const routeName = '/energy';

export const getEnergy = async (energyID: ObjectID): Promise<undefined | Energy> => {
  try {
    const res = await FLASK_HTTPS.get(routeName + '/energy/' + energyID.str);
    return res.data.energy as Energy;
  } catch (error) {
    console.error('Error fetching energy from Flask BE: ', error);
    console.error('Temp tip: have you started the backend?: ');
    return undefined;
  }
};

export const getEnergyMetricForToday = async (userID: ObjectID): Promise<undefined | Energy> => {
  try {
    const res = await FLASK_HTTPS.get(routeName + '/get_energy_metric_for_today/' + userID.str);
    return res.data.energy as Energy;
  } catch (error) {
    console.error('Error fetching energy from Flask BE: ', error);
    console.error('Temp tip: have you started the backend?: ');
    return undefined;
  }
};

export const updateEnergy = async (energy: Energy): Promise<undefined | Energy> => {
  try {
    const res = await FLASK_HTTPS.patch(routeName + '/energy/' + energy._id.str, {
      energy,
    });
    return res.data.energy as Energy;
  } catch (error) {
    console.error('Error fetching energy from Flask BE: ', error);
    console.error('Temp tip: have you started the backend?: ');
    return undefined;
  }
};
