import FLASK_HTTPS from './FLASK_API';
import type { TransportationEntry, TransportationRes } from '../models/Transportation';
import { type ObjectId } from 'mongodb';

const routeName = '/transportation';

export const TransportationAPI = {

  getTransportation: async (transportationID: ObjectId) => {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/transportation/' + transportationID.toHexString());
      return res.data.transportation as TransportationEntry;
    } catch (error) {
      console.error('Error fetching transportation from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  getTransportationEntriesForUserUsingDataRange: async (start: Date, end: Date) => {
    try {
      const res = await FLASK_HTTPS.post(routeName + '/get_transportation_entries_for_user_using_data_range', {
        start,
        end
      });
      return res.data as TransportationRes;
    } catch (error) {
      console.error('Error fetching transportation from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  getTransportationMetricForToday: async (): Promise<undefined | TransportationEntry> => {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/get_transportation_metric_for_today');
      return res.data.transportation as TransportationEntry;
    } catch (error) {
      console.error('Error fetching transportation from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  updateTransportation: async (transportation: TransportationEntry): Promise<undefined | TransportationEntry> => {
    try {
      const res = await FLASK_HTTPS.patch(routeName + '/transportation/' + transportation._id.toString(), {
        transportation,
      });
      return res.data.transportation as TransportationEntry;
    } catch (error) {
      console.error('Error fetching transportation from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  }
}