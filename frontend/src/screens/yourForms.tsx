import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import { getUserLevel, type User } from '../models/User';
import { GetLoggedInUser } from '../APIs/UsersAPI';

export default function YourForms(): JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text> Complete your Food 🍉 Quiz! </Text>
        <Text> Complete your Energy 💡 Quiz! </Text>
        <Text> Complete your Transportation 🚗 Quiz! </Text>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: Colors.LIGHTFGREEN,
  },

});
