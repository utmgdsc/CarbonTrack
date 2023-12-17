import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../components/types';
import { TransportationAPI } from '../APIs/TransportationAPI';
import { type TransportationEntry, type MonthlyEntry } from '../models/Transportation';
import { FoodAPI } from '../APIs/FoodAPI';
import { type FoodEntry } from '../models/Food';
import { EnergyAPI } from '../APIs/EnergyAPI';
import { type EnergyEntry } from '../models/Energy';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function YourForms(): JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });
  const navigation = useNavigation<StackNavigation>();

  const [monthlyData, setMonthlyData] = useState<MonthlyEntry[]>();
  const [startDate] = useState<Date>(new Date(2023, 8, 1));
  const [endDate] = useState<Date>(new Date(2023, 11, 1));
  const [transportationEntry, setTransportationEntry] = useState<TransportationEntry>();
  const [foodEntry, setFoodEntry] = useState<FoodEntry>();
  const [energyEntry, setEnergyEntry] = useState<EnergyEntry>();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async (): Promise<void> => {
        try {
          const transportationEntries =
            await TransportationAPI.getTransportationEntriesForUserUsingDataRange(
              startDate,
              endDate
            );
          if (transportationEntries?.monthlyData != null) {
            setMonthlyData(transportationEntries.monthlyData);
          }

          const transportationMetric = await TransportationAPI.getTransportationMetricForToday();
          if (transportationMetric != null) {
            setTransportationEntry(transportationMetric);
          }

          const foodEntries = await FoodAPI.getFoodEntriesForUserUsingDataRange(startDate, endDate);
          if (foodEntries?.monthlyData != null) {
            setMonthlyData(foodEntries.monthlyData);
          }

          const foodMetric = await FoodAPI.getFoodMetricForToday();
          if (foodMetric != null) {
            setFoodEntry(foodMetric);
          }

          const energyEntries = await EnergyAPI.getEnergyEntriesForUserUsingDataRange(
            startDate,
            endDate
          );
          if (energyEntries?.monthlyData != null) {
            setMonthlyData(energyEntries.monthlyData);
          }

          const energyMetric = await EnergyAPI.getEnergyMetricForToday();
          if (energyMetric != null) {
            setEnergyEntry(energyMetric);
          }
        } catch (error) {
          // Handle errors if needed
          console.error(error);
        }
      };

      void fetchData();
    }, [startDate, endDate]) // Include startDate and endDate in the dependency array
  );

  const onRefresh = (): void => {
    // Simulate a refresh action (e.g., fetch new data)
    setRefreshing(true);

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
    monthlyData === undefined ||
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
      contentContainerStyle={styles.container}
    >
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            navigation.navigate('FoodEntryEdit');
          }}
        >
          <Text style={styles.tabText}>
            This Week&apos;s Food Entry: {Math.round(foodEntry.carbon_emissions).toString()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            navigation.navigate('TransportationEntryEdit');
          }}
        >
          <Text style={styles.tabText}>
            This Week&apos;s Transportation Entry:{' '}
            {Math.round(transportationEntry.carbon_emissions).toString()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            navigation.navigate('EnergyEntryEdit');
          }}
        >
          <Text style={styles.tabText}>
            This Week&apos;s Energy Entry: {Math.round(energyEntry.carbon_emissions).toString()}
          </Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require('../../assets/butterfly.png')}
        style={styles.bottomImage}
        resizeMode="contain"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.LIGHTFGREEN,
  },
  tabContainer: {
    marginTop: 40,
    marginHorizontal: 20,
  },
  tab: {
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.GREYGREEN,
    backgroundColor: Colors.GREYGREEN,
    marginTop: 20,
    justifyContent: 'center',
  },
  tabText: {
    fontWeight: '700',
    fontFamily: 'Montserrat',
    color: Colors.DARKGREEN,
    textAlign: 'left',
    fontSize: 16,
  },
  bottomImage: {
    position: 'absolute',
    bottom: 0, // Position at the bottom
    width: '100%', // Take full width
    height: 400, // Define height as needed or use a fixed value
  },
});
