import axios from 'axios';
import firebaseService from '../utilities/firebase';
const FLASK_LOCAL_ADDRESS: string = 'http://192.168.2.12:6050';

// Function to get the Firebase authentication token
const getFirebaseAuthToken = async (): Promise<string | null> => {
  // Assume you have a Firebase authentication instance
  const firebaseUser = await firebaseService.getFirebaseUser();
  if (firebaseUser != null) {
    // Get the user token
    const token = await firebaseUser.getIdToken(true);
    return token;
  } else {
    // Handle the case when the user is not signed in
    return null;
  }
};

const instance = axios.create({
  baseURL: FLASK_LOCAL_ADDRESS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the token in the headers of each request
instance.interceptors.request.use(
  async (config) => {
    const token = await getFirebaseAuthToken();
    console.log(token);

    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  async (error) => {
    // Handle request error
    return await Promise.reject(error);
  }
);

export default instance;
