import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';

export default function DashBoardScreen():JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }

  return (
  <View style={styles.container}>
    <Text style={styles.text}> DashBoard </Text>
    <StatusBar style="auto" />
  </View>
  );
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: Colors.WHITE,
      flex: 1,
      justifyContent: 'center',
    },
    text: {
      color: Colors.DARKLIMEGREEN,  
      fontFamily: 'Montserrat', 
      fontSize: 30, 
      fontWeight: '700', 
    },
  });
  