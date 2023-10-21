import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/components/types';
import HomeScreen from './src/screens/home';
import LogInScreen from './src/screens/login';
import { Sign } from 'crypto';
import SignUpScreen from './src/screens/signup';
import AppNavigation from './src/components/appNavigation'



export default function App(){
  return <AppNavigation/>;
}

// // function HomeScreen() {
// //   return (
// //   <View style={styles.container}>
// //     <Text style={{ fontFamily: 'Montserrat', fontSize: 30 }}> Carbon Track </Text>
// //     <StatusBar style="auto" />
// //   </View>
// //   );
// // }

// const Stack = createNativeStackNavigator<RootStackParamList>();


// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="LogIn" component={LogInScreen} />
//         <Stack.Screen name="SignUp" component={SignUpScreen} //
//         <Stack.Screen name="DashBoard" component={DashBoardScreen} />//
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// // });
