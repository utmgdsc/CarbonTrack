import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../components/types';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function FoodForum(): JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calculate your food intake:</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: Colors.LIGHTFGREEN,
  },
  header: {
    color: Colors.DARKGREEN,
    fontFamily: 'Montserrat',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 30,
  },
});
