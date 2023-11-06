import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import HomeScreen from '../screens/home';
import LogInScreen from '../screens/login';
import SignUpScreen from '../screens/signup';
import DashBoardScreen from '../screens/dashboard';
import Forum from '../screens/forum';
import FoodForum from '../screens/foodForum';
import EnergyForum from '../screens/energyForum';


const Stack = createNativeStackNavigator<RootStackParamList>();


 const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="DashBoard" component={DashBoardScreen} />
        <Stack.Screen name="Forum" component={Forum} />
        <Stack.Screen name="FoodForum" component={FoodForum} />
        <Stack.Screen name="EnergyForum" component={EnergyForum} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;