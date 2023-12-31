import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Fontisto, AntDesign } from '@expo/vector-icons';
import Colors from '../../assets/colorConstants';

import HomeScreen from '../screens/home';
import LogInScreen from '../screens/login';
import SignUpScreen from '../screens/signup';
import WelcomeScreen from '../screens/welcomePage';
import SignUpQuestions from '../screens/signUpQuestions';

import Forum from '../screens/forum';
import FoodForum from '../screens/Food/foodForum';
import EnergyForum from '../screens/Energy/energyForum';
import TransportationForum from '../screens/Transportation/transportationForum';
import YourForms from '../screens/yourForms';

import DashBoardScreen from '../screens/dashboard';
import CommunityHub from '../screens/communityHub';
import FootprintDecomp from '../screens/footpringDecomp';

import SettingsScreen from '../screens/settings/settings';
import UpdatePasswordScreen from '../screens/settings/updatePassword';
import UpdateProfileScreen from '../screens/settings/updateProfile';
import UpdateHomeScreen from '../screens/settings/updateHomeScreen';



import TransportationEntryEdit from '../screens/Transportation/transportationEntryEdit';
import FoodHistory from '../screens/Food/foodHistory';
import TransportationHistory from '../screens/Transportation/transportationHistory';
import EnergyHistory from '../screens/Energy/energyHistory';
import EnergyEntryEdit from '../screens/Energy/energyEntryEdit';
import FoodEntryEdit from '../screens/Food/foodEntryEdit';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigation = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="LogIn" component={LogInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="MainApp" component={MainAppTabs} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Forum" component={Forum}  />
        
        <Stack.Screen name='FootprintDecomp'
          component={FootprintDecomp}
          options={{
            title: 'Your Footprint Decomposition',
            headerStyle: {
              backgroundColor: Colors.DARKGREEN,
            },
            headerTintColor: Colors.WHITE,
          }}
        />

        <Stack.Screen name='UpdateProfile'
          component={UpdateProfileScreen}
          options={{ headerShown: false }} />

        <Stack.Screen name='UpdatePassword'
          component={UpdatePasswordScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen name='UpdateHomeInfo'
          component={UpdateHomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TransportationForum"
          component={TransportationForum}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TransportationEntryEdit"
          component={TransportationEntryEdit}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TransportationHistory"
          component={TransportationHistory}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="FoodForum" component={FoodForum} options={{ headerShown: false }} />
        <Stack.Screen
          name="FoodEntryEdit"
          component={FoodEntryEdit}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="FoodHistory" component={FoodHistory} options={{ headerShown: false }} />

        <Stack.Screen name="EnergyForum" component={EnergyForum} options={{ headerShown: false }} />
        <Stack.Screen
          name="EnergyEntryEdit"
          component={EnergyEntryEdit}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EnergyHistory"
          component={EnergyHistory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpQuestions"
          component={SignUpQuestions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainAppTabs = (): JSX.Element => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.LIGHTFGREEN,
        tabBarInactiveTintColor: Colors.WHITE,
        tabBarStyle: {
          backgroundColor: Colors.DARKGREEN,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={'home-sharp'}
              size={24}
              style={{ color: (focused as boolean) ? Colors.LIGHTFGREEN : Colors.WHITE }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="YourForms"
        component={YourForms}
        options={{
          title: 'My Forms',
          headerStyle: { backgroundColor: Colors.DARKGREEN },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="form"
              size={24}
              color="black"
              style={{ color: (focused as boolean) ? Colors.LIGHTFGREEN : Colors.WHITE }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CommunityHub"
        component={CommunityHub}
        options={{
          title: 'Community Hub',
          headerStyle: { backgroundColor: Colors.DARKGREEN },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarIcon: ({ focused }) => (
            <Fontisto
              name="world-o"
              size={24}
              color="black"
              style={{ color: (focused as boolean) ? Colors.LIGHTFGREEN : Colors.WHITE }}
            />
          ),
        }}
      />
            <Tab.Screen
        name="SettingsPage"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: Colors.DARKGREEN },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={'settings'}
              size={24}
              style={{ color: (focused as boolean) ? Colors.LIGHTFGREEN : Colors.WHITE }}
            />
          ),
        }}
      />
    </Tab.Navigator>

  );
};

const DashboardStack = (): React.JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name="DashBoard"
      component={DashBoardScreen}
      options={{
        title: 'Dashboard',
        headerStyle: { backgroundColor: Colors.DARKGREEN },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        gestureEnabled: false,
      }}
    />
  </Stack.Navigator>
);

export default AppNavigation;