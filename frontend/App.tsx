import * as React from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import { useFonts } from 'expo-font';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { RootStackParamList } from './src/components/types';
// import HomeScreen from './src/screens/home';
// import LogInScreen from './src/screens/login';
// import { Sign } from 'crypto';
// import SignUpScreen from './src/screens/signup';
import AppNavigation from './src/components/appNavigation'
// import firebaseService from './src/utilities/firebase';

export default function App(): JSX.Element{
  return <AppNavigation/>;
}
