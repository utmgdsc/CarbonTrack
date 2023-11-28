import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import HomeScreen from '../screens/home';
import LogInScreen from '../screens/login';
import SignUpScreen from '../screens/signup';
import DashBoardScreen from '../screens/dashboard';
import Forum from '../screens/forum';
import FoodForum from '../screens/Food/foodForum';
import EnergyForum from '../screens/Energy/energyForum';
import TransportationForum from '../screens/Transportation/transportationForum';
import TransportationEntryEdit from '../screens/Transportation/transportationEntryEdit';
import FoodHistory from '../screens/Food/foodHistory';
import TransportationHistory from '../screens/Transportation/transportationHistory';
import EnergyHistory from '../screens/Energy/energy';
import EnergyEntryEdit from '../screens/Energy/energyEntryEdit';
import FoodEntryEdit from '../screens/Food/foodEntryEdit';

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
        
        <Stack.Screen name="TransportationForum" component={TransportationForum} />
        <Stack.Screen name="TransportationEntryEdit" component={TransportationEntryEdit} />
        <Stack.Screen name="TransportationHistory" component={TransportationHistory} />

        <Stack.Screen name="FoodForum" component={FoodForum} />
        <Stack.Screen name="FoodEntryEdit" component={FoodEntryEdit} />
        <Stack.Screen name="FoodHistory" component={FoodHistory} />

        <Stack.Screen name="EnergyForum" component={EnergyForum} />
        <Stack.Screen name="EnergyEntryEdit" component={EnergyEntryEdit} />
        <Stack.Screen name="EnergyHistory" component={EnergyHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
