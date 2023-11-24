import FLASK_HTTPS from './FLASK_API';
import type { User } from '../models/User';
import firebaseService from '../utilities/firebase';

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

  getUser: async (userID: string)=> {
    try {
      const res = await FLASK_HTTPS.get(routeName + '/user/' + userID);
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
      const res = await FLASK_HTTPS.put(routeName + '/user', {
        user,
      });
      return res.data.user as User;
    } catch (error) {
      console.error('Error creating user in Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  },
  
  updateUser: async (user: User)=> {
    try {
      const res = await FLASK_HTTPS.patch(routeName + '/user/' + user._id, {
        user,
      });
      return res.data.user as User;
    } catch (error) {
      console.error('Error fetching user from Flask BE: ', error);
      console.error('Temp tip: have you started the backend?: ');
      return undefined;
    }
  }
}
