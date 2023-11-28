import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import ProfileWidgetBox from '../widgets/profileWidget';
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

export default function DashBoardScreen(): JSX.Element {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [transportationEntry, setTransportationEntry] = useState<TransportationEntry>();
  const [foodEntry, setFoodEntry] = useState<FoodEntry>();
  const [energyEntry, setEnergyEntry] = useState<EnergyEntry>();
  const [photoURL] = useState<string>("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png");

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
        setTransportationEntry(res)
      }
    });
    void FoodAPI.getFoodMetricForToday().then((res) => {
      if (res != null) {
        setFoodEntry(res)
      }
    });
    void EnergyAPI.getEnergyMetricForToday().then((res) => {
      if (res != null) {
        setEnergyEntry(res)
      }
    });
  }, [loaded]);

  if (!loaded || user === undefined || transportationEntry === undefined || foodEntry === undefined || energyEntry === undefined) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerBox}>
          <Text style={styles.header}>Dashboard</Text>
        </View>
      </View>

      <View style={styles.profileWidgetContainer}>
        <View style={styles.widgetBoarder}>
            <ProfileWidgetBox
            photoURL={photoURL}
            user={user}
            />
          </View>
      </View>

      <View style={styles.widgetContainer}>

        <View style={styles.widgetBoarder}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TransportationHistory');
            }}
          >
            <WidgetBox title="Transportatin" content={transportationEntry.carbon_emissions.toString()} />
          </TouchableOpacity>
        </View>

        <View style={styles.widgetBoarder}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FoodHistory');
            }}
          >
            <WidgetBox title="Food" content={foodEntry.carbon_emissions.toString()} />
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
            <WidgetBox title="Energy" content={energyEntry.carbon_emissions.toString()} />
          </TouchableOpacity>
        </View>

        <View style={styles.widgetBoarder}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Settings');
            }}
          >
            <WidgetBox title="Settings" content={"Access User Settings"} />
          </TouchableOpacity>
        </View>

      </View>
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
  header: {
    fontSize: 24,
  },
  headerBox: {
    backgroundColor: Colors.WHITE,
  },
  headerContainer: {
    alignItems: 'center',
  },
  profileWidgetContainer: {
    padding: 10,
    flexDirection: 'column',
  },
  widgetContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  widgetBoarder: {
    padding: 10,
  },
});
