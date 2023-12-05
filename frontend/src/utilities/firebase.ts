import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  initializeAuth,
  getReactNativePersistence,
  updateProfile
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: 'AIzaSyA8d5XfMBK2X4Udf-pD9vWHS1SYeex8Qo4',
  authDomain: 'carbon-track-system.firebaseapp.com',
  projectId: 'carbon-track-system',
  storageBucket: 'carbon-track-system.appspot.com',
  messagingSenderId: '617921267809',
  appId: '1:617921267809:web:47601de3a68a0ea29c4220',
};
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const storage = getStorage(app);

const firebaseService = {
  getFirebaseUser: async () => {
    const user = getAuth().currentUser;
    if (user != null) {
      return user;
    }
  },

  createUser: async (email: string, password: string) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User is created successfully with email:', userCred.user.email);
    } catch (error) {
      console.error('Error occured creating the user account:', error);
    }
  },

  signInUser: async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  signOutUser: async () => {
    await signOut(auth);
  },

  uploadProfilePicture: async (userId: string, imageUri: string): Promise<void> => {
    const storagePath = `profilePictures/${userId}/profilePicture.jpg`; 
    const profilePictureRef = storageRef(storage, storagePath);

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      await uploadBytes(profilePictureRef, blob);

      const downloadURL = await getDownloadURL(profilePictureRef);

      const user = getAuth().currentUser;
      if (user != null) {
        await updateProfile(user, { photoURL: downloadURL });
      }
    } catch (error) {
      console.error('Error occurred while uploading profile picture:', error);
    }
  },
  getProfilePicture: async (): Promise<string | null> => {
    const user = getAuth().currentUser;

    if (user?.photoURL != null) {
      return user.photoURL;
    }

    return null;
  },

};

export default firebaseService;