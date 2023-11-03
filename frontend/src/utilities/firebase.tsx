import { initializeApp,  } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,  } from 'firebase/auth';
import {createUser} from "../APIs/UsersAPI";
import ObjectID from "bson-objectid";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8d5XfMBK2X4Udf-pD9vWHS1SYeex8Qo4",
    authDomain: "carbon-track-system.firebaseapp.com",
    projectId: "carbon-track-system",
    storageBucket: "carbon-track-system.appspot.com",
    messagingSenderId: "617921267809",
    appId: "1:617921267809:web:47601de3a68a0ea29c4220"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const firebaseService = {
  
  createUser: async (email: string, password: string) => {
    try{
      // const auth = getAuth();
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCred.user);
    } catch(error) {
      alert("Invalid input bithc");
      }
  },

  signInUser: async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  signOutUser: async () => {
      await signOut(auth);
  },
};

export default firebaseService;