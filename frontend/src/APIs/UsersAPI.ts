import FLASK_HTTPS from './FLASK_API';
import type { User } from '../models/User';
import firebaseService from '../utilities/firebase';
import { type ObjectId } from 'mongodb';
import axios, { type AxiosError } from 'axios';

const routeName = '/users';

export const UsersAPI = {
  GetLoggedInUser: async () => {
    const firebaseUser = await firebaseService.getFirebaseUser();
    if (firebaseUser != null) {
      if (firebaseUser.email != null) {
        return await UsersAPI.getUserByEmail(firebaseUser.email);
      }
    }
  },

  GetCurrUserByUID: async () => {
    const firebaseUser = await firebaseService.getFirebaseUser();
    if (firebaseUser != null) {
      if (firebaseUser.uid != null) {
        return await UsersAPI.queryAuthenticatedUser();
      }
    }
  },

  getUser: async (userID: ObjectId) => {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/user/' + userID.toHexString());
      return res.data.user as User;
    } catch (error) {
      console.error('Error fetching user from Flask BE: ', error);
      return undefined;
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/user_email/' + email);
      return res.data.user as User;
    } catch (error) {
      console.error('Error fetching user from Flask BE using email:', error);
      return undefined;
    }
  },

  queryAuthenticatedUser: async () => {
    try {
      const res = await FLASK_HTTPS.get<User>(routeName + '/current');
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        console.error('Error querying user from Flask BE:', {
          message: axiosError.message,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          responseData: axiosError.response?.data,
        });
      } else {
        // Log generic error
        console.error('Error querying user from Flask BE:', error);
      }

      return undefined;
    }
  },

  createUser: async (user: User) => {
    try {
      console.log(user);
      const res = await FLASK_HTTPS.put(routeName + '/user', {
        user,
      });
      if (res.data.user != null) {
        return res.data.user as User;
      } else if (res.data.error != null) {
        return res.data.error as string;
      }
    } catch (error) {
      console.error('Error creating user in Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },

  updateUser: async (user: User) => {
    try {
      const res = await FLASK_HTTPS.patch(routeName + '/user/' + user._id.toString(), {
        user,
      });
      return res.data.user as User;
    } catch (error) {
      console.error('Error fetching user from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  updateUserEmail: async (email: string) => {
    try {
      // Ensure that firebaseUser is defined before using it
      const firebaseUser = await firebaseService.getFirebaseUser();

      if (firebaseUser == null) {
        console.error('Firebase user is undefined');
        return undefined;
      }

      // Get the refreshed token
      const newToken = await firebaseUser.getIdToken(true);

      // Make the request to update the email with the new token
      const res = await FLASK_HTTPS.patch(
        routeName + `/user/update_email/${firebaseUser.uid.toString()}`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        }
      );

      return res.data.user as User;
    } catch (error) {
      console.error('UsersAPI(frontend): updateUserEmailError:', error);
      return undefined;
    }
  },
  updateUserName: async (user: User, newName: string) => {
    try {
      const res = await FLASK_HTTPS.patch(
        routeName + `/user/update_name/${user.uid.toString()}`,
        { newName },
      );

      return res.data.user as User;
    } catch (error) {
      console.error('UsersAPI(frontend): updateUserEmailError:', error);
      return undefined;
    }
  }
};
