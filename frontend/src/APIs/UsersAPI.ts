import FLASK_HTTPS from './FLASK_API';
import type { User } from '../models/User';
import firebaseService from '../utilities/firebase';
import { type ObjectId } from 'mongodb';

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

  getUser: async (userID: ObjectId)=> {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/user/' + userID.toHexString());
      return res.data.user as User;
    } catch (error) {
      console.error('Error fetching user from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  getUserByEmail: async (email: string)=> {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/user_email/' + email);
      return res.data.user as User;
    } catch (error) {
      console.error('Error fetching user from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  createUser: async (user: User)=> {
    try {
      console.log(user)
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
  
  updateUser: async (user: User)=> {
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
  updateUserEmail: async (userId: ObjectId, newEmail: string) => {
    try {
      // Ensure that firebaseUser is defined before using it
      const firebaseUser = await firebaseService.getFirebaseUser();
      if (firebaseUser == null) {
        // Handle the case when the user is not signed in
        console.error('Firebase user is undefined');
        return undefined;
      }

      // Get the refreshed token
      const newToken = await firebaseUser.getIdToken(true);

      // Make the request to update the email with the new token
      const res = await FLASK_HTTPS.patch(
        routeName + `/user/update_email/${userId.toHexString()}`,
        { email: newEmail },
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
}
