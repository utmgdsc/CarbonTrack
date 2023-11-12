import FLASK_HTTPS from './FLASK_API';
import type ObjectID from 'bson-objectid';
import type { User } from '../models/User';
import firebaseService from '../utilities/firebase';

const routeName = '/users';

export const GetLoggedInUser = async (): Promise<undefined | User> => {
  const firebaseUser = await firebaseService.getFirebaseUser();
  if (firebaseUser != null) {
    if (firebaseUser.email != null) {
      return await getUserByEmail(firebaseUser.email);
    }
  }
};

export const getUser = async (userID: ObjectID): Promise<undefined | User> => {
  try {
    const res = await FLASK_HTTPS.get(routeName + '/user/' + userID.str);
    return res.data.user as User;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getUserByEmail = async (email: string): Promise<undefined | User> => {
  try {
    const res = await FLASK_HTTPS.get(routeName + '/user_email/' + email);
    return res.data.user as User;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const createUser = async (user: User): Promise<undefined | User> => {
  try {
    const res = await FLASK_HTTPS.put(routeName + '/user', {
      user,
    });
    return res.data.user as User;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
