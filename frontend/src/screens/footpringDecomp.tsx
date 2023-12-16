import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import WidgetBox from '../widgets/widgetBox';
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
      <View style={styles.widgetContainer}>
        <View style={styles.widgetBoarder}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TransportationHistory');
            }}
          >
            <WidgetBox
              title="Transportatin"
              content={Math.round(transportationEntry.carbon_emissions).toString()}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.widgetBoarder}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FoodHistory');
            }}
          >
            <WidgetBox title="Food" content={Math.round(foodEntry.carbon_emissions).toString()} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.widgetContainer}>
        <View style={styles.widgetBoarder}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EnergyHistory');
            }}
          >
            <WidgetBox
              title="Energy"
              content={Math.round(energyEntry.carbon_emissions).toString()}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHTFGREEN,
    flexGrow: 1,
  },
  widgetContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  widgetBoarder: {
    padding: 10,
  },
});
