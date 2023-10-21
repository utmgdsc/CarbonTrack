import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
<<<<<<< Updated upstream
=======
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


function HomeScreen() {
  return (
  <View style={styles.container}>
    <Text style={{ fontFamily: 'Montserrat', fontSize: 30 }}>Carbon Track </Text>
    <StatusBar style="auto" />
  </View>
  );
}

const Stack = createNativeStackNavigator();

>>>>>>> Stashed changes

export default function App() {
  return (
<<<<<<< Updated upstream
    <View style={styles.container}>
      <Text> CarbonTrack </Text>
      <StatusBar style="auto" />
    </View>
=======
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
>>>>>>> Stashed changes
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
