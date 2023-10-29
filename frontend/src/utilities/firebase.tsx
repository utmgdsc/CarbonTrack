import * as firebase from 'firebase/app';
import { initializeApp,  } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,  } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User has been signed in successfully, you can optionally return some data or handle it here
    } catch (error) {
      throw error; // Rethrow the error to handle it in your component
    }
  },

  signOutUser: async () => {
    try {
      await signOut(auth);
      // User has been signed out successfully, you can optionally return some data or handle it here
    } catch (error) {
      throw error; // Rethrow the error to handle it in your component
    }
  },
};

export default firebaseService;