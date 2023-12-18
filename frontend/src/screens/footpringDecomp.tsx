import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import type { RootStackParamList } from '../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { type User } from '../models/User';
import { UsersAPI } from '../APIs/UsersAPI';
import { type TransportationEntry } from '../models/Transportation';
import { TransportationAPI } from '../APIs/TransportationAPI';
import { type FoodEntry } from '../models/Food';
import { type EnergyEntry } from '../models/Energy';
import { FoodAPI } from '../APIs/FoodAPI';
import { EnergyAPI } from '../APIs/EnergyAPI';
import { AntDesign, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function FootprintDecomp(): JSX.Element {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [transportationEntry, setTransportationEntry] = useState<TransportationEntry>();
  const [foodEntry, setFoodEntry] = useState<FoodEntry>();
  const [energyEntry, setEnergyEntry] = useState<EnergyEntry>();

  const navigation = useNavigation<StackNavigation>();

  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  useEffect(() => {
    void UsersAPI.GetLoggedInUser().then((res) => {
      if (res != null) {
        setUser(res);
      }
    });
    void TransportationAPI.getTransportationMetricForToday().then((res) => {
      if (res != null) {
        setTransportationEntry(res);
      }
    });
    void FoodAPI.getFoodMetricForToday().then((res) => {
      if (res != null) {
        setFoodEntry(res);
      }
    });
    void EnergyAPI.getEnergyMetricForToday().then((res) => {
      if (res != null) {
        setEnergyEntry(res);
      }
    });
  }, [loaded]);

  if (
    !loaded ||
    user === undefined ||
    transportationEntry === undefined ||
    foodEntry === undefined ||
    energyEntry === undefined
  ) {
    return <></>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.buttons} onPress={() => {navigation.navigate('TransportationHistory');}}> 
          <AntDesign name="car" size={24} color={Colors.DARKDARKGREEN} style={styles.icon} />
          <Text style={styles.labels}> Transportation </Text>
          <AntDesign name="arrowright" size={24} color={Colors.DARKDARKGREEN} style={styles.nextButton}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttons} onPress={() => {navigation.navigate('FoodHistory');}}> 
          <MaterialCommunityIcons name="food-apple-outline" size={24} color={Colors.DARKDARKGREEN} style={styles.icon} />
          <Text style={styles.labels}> Food </Text>
          <AntDesign name="arrowright" size={24} color={Colors.DARKDARKGREEN} style={styles.nextButton}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttons} onPress={() => {navigation.navigate('EnergyHistory');}}> 
          <SimpleLineIcons name="energy" size={24} color={Colors.DARKDARKGREEN} style={styles.icon} />
          <Text style={styles.labels}> Energy </Text>
          <AntDesign name="arrowright" size={24} color={Colors.DARKDARKGREEN} style={styles.nextButton}/>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHTFGREEN,
    flexGrow: 1,
  },
  buttonsContainer:{
    alignItems: 'center',
  },
  buttons:{
    width: '85%', 
    height: 56,
    borderRadius: 15,
    backgroundColor: Colors.TRANSLIGHTGREEN2,
    marginVertical: 10,
    justifyContent: 'center',
  }, 
  labels:{
    fontWeight: '600', 
    color: Colors.DARKDARKGREEN,
    fontSize: 18,
    marginLeft: '14%',
  },
  nextButton:{
    position: 'absolute',
    left: '85%',
  }, 
  icon:{
    position: 'absolute',
    left: '5%',
  }
});
