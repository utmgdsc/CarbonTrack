import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../components/types';
import { useFonts } from 'expo-font';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function EnergyForum() {
  const navigation = useNavigation<StackNavigation>();
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  
  return (
  <View style={styles.container}>
      <Text style={styles.header}>
        Calculate your energy usage:
      </Text>
  </View>
  
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        paddingHorizontal: 30,
        backgroundColor: '#E0EEC6'
    },
    header: {
        color: '#2E3E36', 
        fontFamily: 'Montserrat', 
        fontSize: 30, 
        fontWeight: '700',
        marginBottom: 30,
      },
  });