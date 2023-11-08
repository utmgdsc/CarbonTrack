// import { useNavigation } from '@react-navigation/native';
import { initializeApp,  } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, initializeAuth } from 'firebase/auth';
// import { type StackNavigationProp } from '@react-navigation/stack';

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

// import { type RootStackParamList } from '../components/types';
// export type StackNavigation = StackNavigationProp<RootStackParamList>;
// const navigation = useNavigation<StackNavigation>();

const firebaseService = {

  getFirebaseUser: async () => {
    const user = getAuth().currentUser;
    if (user) {
      return user
    } else {
      
    }
  },
  
  createUser: async (email: string, password: string) => {
    try{
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCred.user);
    } catch(error) {
      alert("Error occured making your account.");
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