import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';

import ProfileWidgetBox from '../widgets/profileWidget';
import CarbonWidgetBox from '../widgets/carbonWidgetBox';
import ChallengesWidget from '../widgets/challengesWidgetBox';

import type { RootStackParamList } from '../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';

import { type User } from '../models/User';
import { UsersAPI } from '../APIs/UsersAPI';
import { type TransportationEntry } from '../models/Transportation';
import { TransportationAPI } from '../APIs/TransportationAPI';
import { type FoodEntry } from '../models/Food';
import { type EnergyEntry } from '../models/Energy';
import { FoodAPI } from '../APIs/FoodAPI';
import { EnergyAPI } from '../APIs/EnergyAPI';
import sampleChallenges from '../components/sampleData/sampleChllgInput';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function DashBoardScreen(): JSX.Element {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [transportationEntry, setTransportationEntry] = useState<TransportationEntry>();
  const [foodEntry, setFoodEntry] = useState<FoodEntry>();
  const [energyEntry, setEnergyEntry] = useState<EnergyEntry>();
  const [refreshing, setRefreshing] = useState(false);


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

  const onRefresh = (): void => {
    // Simulate a refresh action (e.g., fetch new data)
    setRefreshing(true);

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

    setTimeout(() => {
      setRefreshing(false); // Set refreshing to false after data is fetched
    }, 2000); // Simulating a 2-second delay
  };

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
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0000ff" />
      }
      style={styles.container}
    >
      <View style={styles.profileWidgetContainer}>
        <View style={styles.widgetBoarder}>

            <ProfileWidgetBox
            user={user}
            />
          </View>
          <View style={styles.widgetBoarder}>
              <CarbonWidgetBox carbonUser={user} />
          </View>
          <View style={styles.profileWidgetContainer}>
              <ChallengesWidget challenges={sampleChallenges}/>
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
  profileWidgetContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  widgetBoarder: {
    padding: 10,
  },
});
