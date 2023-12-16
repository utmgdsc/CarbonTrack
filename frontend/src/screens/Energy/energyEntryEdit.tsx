import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../../components/types';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Colors from '../../../assets/colorConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EnergyAPI } from '../../APIs/EnergyAPI';
import { type EnergyEntry } from '../../models/Energy';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function EnergyEntryEdit(): JSX.Element {
  interface SliderData {
    id: number;
    label: string;
    minValue: number;
    maxValue: number;
    initialValue: number;
  }

  const [energyEntry, setEnergyEntry] = useState<EnergyEntry>();

  const [slidersData, setSliderData] = useState<SliderData[]>([]);

  const [heatingOilUsage, setHeatingOilUsage] = useState(0);
  const [naturalGasUsage, setNaturalGasUsage] = useState(0);
  const [electricityUsage, setElectricityUsage] = useState(0);
  const [householdUsage, setHouseholdUsage] = useState(0);

  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const navigation = useNavigation<StackNavigation>();

  const handleSurveySubmit = (): void => {
    // Process survey responses, e.g., send them to a server
    if (energyEntry != null) {
      const newEntry: EnergyEntry = {
        _id: energyEntry._id,
        user_id: energyEntry.user_id,
        carbon_emissions: energyEntry.carbon_emissions,
        date: energyEntry.date,
        heating_oil: heatingOilUsage,
        natural_gas: naturalGasUsage,
        electricity: electricityUsage,
        province: energyEntry.province,
        household: householdUsage,
      };
      void EnergyAPI.updateEnergy(newEntry).then(() => {
        navigation.navigate('DashBoard');
      });
    }
  };

  useEffect(() => {
    if (energyEntry != null) {
      setSliderData([
        {
          id: 1,
          label: 'Heating Oil',
          minValue: 0,
          maxValue: 800,
          initialValue: energyEntry.heating_oil,
        },
        {
          id: 2,
          label: 'Natural Gas',
          minValue: 0,
          maxValue: 800,
          initialValue: energyEntry.natural_gas,
        },
        {
          id: 3,
          label: 'Electricity',
          minValue: 0,
          maxValue: 800,
          initialValue: energyEntry.electricity,
        },
        {
          id: 4,
          label: 'House Hold Members',
          minValue: 1,
          maxValue: 10,
          initialValue: energyEntry.household,
        },
      ]);
      setHeatingOilUsage(energyEntry.heating_oil);
      setNaturalGasUsage(energyEntry.natural_gas);
      setElectricityUsage(energyEntry.electricity);
      setHouseholdUsage(energyEntry.household);
    }
  }, [energyEntry]);

  useEffect(() => {
    void EnergyAPI.getEnergyMetricForToday().then((res) => {
      if (res != null) {
        setEnergyEntry(res);
      }
    });
  }, [loaded]);

  if (!loaded || slidersData.length === 0) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.header}>Calculate your emissions from energy:</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>What is your monthly electricity consumption, in kWh:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder={String(energyEntry?.electricity)}
            onChangeText={(text) => {
              setElectricityUsage(Number(text));
            }}
          />
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            What is your monthly natural gas consumption, in {'m\u00B3'}:
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder={String(energyEntry?.natural_gas)}
            onChangeText={(text) => {
              setNaturalGasUsage(Number(text));
            }}
          />
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            What is your monthly heating oil consumption, in litres:
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder={String(energyEntry?.heating_oil)}
            onChangeText={(text) => {
              setHeatingOilUsage(Number(text));
            }}
          />
        </View>

        <TouchableOpacity style={styles.buttoning} onPress={handleSurveySubmit}>
          <Text style={styles.buttoningText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.LIGHTFGREEN,
  },
  scrollContainer: {
    paddingTop: 30,
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: Colors.LIGHTFGREEN,
  },
  header: {
    color: Colors.DARKGREEN,
    fontFamily: 'Montserrat',
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.GREY,
    padding: 8,
    margin: 10,
    width: 200,
    backgroundColor: Colors.WHITE,
  },
  question: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.DARKGREEN,
    marginBottom: 20,
  },
  buttoning: {
    backgroundColor: Colors.DARKGREEN,
    borderRadius: 10,
    marginBottom: 70,
    padding: 18,
  },
  buttoningText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  questionContainer: {
    paddingBottom: 30,
  },
});
