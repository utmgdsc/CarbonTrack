import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types'


export default function LogInScreen() {
  return (
  <View style={styles.container}>
    <Text style={{ fontFamily: 'Montserrat', fontSize: 30, color: '243E36' }}> Log In! </Text>
    <StatusBar style="auto" />
  </View>
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
  