import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import HomeScreen from '../screens/home';
import LogInScreen from '../screens/login';
import SignUpScreen from '../screens/signup';
import DashBoardScreen from '../screens/dashboard';
import Forum from '../screens/forum';
import FoodForum from '../screens/foodForum';
import EnergyForum from '../screens/energyForum';
import TransportationForum from '../screens/transportationForum';
import FoodHistory from '../screens/foodHistory';
import TransportationHistory from '../screens/transportationHistory';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="DashBoard" component={DashBoardScreen} />
        <Stack.Screen name="Forum" component={Forum} />
        <Stack.Screen name="FoodForum" component={FoodForum} />
        <Stack.Screen name="EnergyForum" component={EnergyForum} />
        <Stack.Screen name="TransportationForum" component={TransportationForum} />
        <Stack.Screen name="FoodHistory" component={FoodHistory} />
        <Stack.Screen name="TransportationHistory" component={TransportationHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
