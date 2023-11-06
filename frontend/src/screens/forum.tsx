import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../components/types'
import Colors from '../../assets/colorConstants';
// import { Colors } from 'react-native/Libraries/NewAppScreen';


export default function Forum():JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textStylez}> Forum </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor:  Colors.WHITE,
      flex: 1,
      justifyContent: 'center',
    },
    textStylez: { 
      color: Colors.DARKLIMEGREEN, 
      fontFamily: 'Montserrat', 
      fontSize: 30, 
      fontWeight: '700', }
  });
  