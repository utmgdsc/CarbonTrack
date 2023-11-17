import FLASK_HTTPS from './FLASK_API';
import type ObjectID from 'bson-objectid';
import type { Transportation } from '../models/Transportation';

const routeName = '/transportation';

export const getTransportation = async (transportationID: ObjectID): Promise<undefined | Transportation> => {
  try {
    const res = await FLASK_HTTPS.get(routeName + '/transportation/' + transportationID.str);
    return res.data.transportation as Transportation;
  } catch (error) {
    console.error('Error fetching transportation from Flask BE: ', error);
    console.error('Temp tip: have you started the backend?: ');
    return undefined;
  }
};

export const getTransportationMetricForToday = async (userID: ObjectID): Promise<undefined | Transportation> => {
  try {
    const res = await FLASK_HTTPS.get(routeName + '/get_transportation_metric_for_today/' + userID.str);
    return res.data.transportation as Transportation;
  } catch (error) {
    console.error('Error fetching transportation from Flask BE: ', error);
    console.error('Temp tip: have you started the backend?: ');
    return undefined;
  }
};

export const updateTransportation = async (transportation: Transportation): Promise<undefined | Transportation> => {
  try {
    const res = await FLASK_HTTPS.patch(routeName + '/transportation/' + transportation._id.str, {
      transportation,
    });
    return res.data.transportation as Transportation;
  } catch (error) {
    console.error('Error fetching transportation from Flask BE: ', error);
    console.error('Temp tip: have you started the backend?: ');
    return undefined;
  }
};