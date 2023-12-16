import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import * as React from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../../components/types';
import { useFonts } from 'expo-font';
import Colors from '../../../assets/colorConstants';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsersAPI } from '../../APIs/UsersAPI';
import { type User } from '../../models/User';
import { EnergyAPI } from '../../APIs/EnergyAPI';
import { type EnergyEntry } from '../../models/Energy';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function EnergyForum(): JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const navigation = useNavigation<StackNavigation>();

  const [energyEntry, setEnergyEntry] = useState<EnergyEntry>();

  const [electricalConsumption, setElectricalConsumption] = useState(0);
  const [heatingOil, setHeatingOil] = useState(0);
  const [naturalGas, setNaturalGas] = useState(0);

  const [user, setUser] = useState<User | undefined>(undefined);

  const handleSurveySubmit = (): void => {
    // Process survey responses, e.g., send them to a server
    if (energyEntry != null && user != null) {
      const newEntry: EnergyEntry = {
        _id: energyEntry._id,
        user_id: energyEntry.user_id,
        carbon_emissions: energyEntry.carbon_emissions,
        date: energyEntry.date,
        heating_oil: heatingOil,
        natural_gas: naturalGas,
        electricity: electricalConsumption,
        province: user.province,
        household: user.household,
      };
      void EnergyAPI.updateEnergy(newEntry).then(() => {
        navigation.navigate('MainApp');
      });
    }
  };
  useEffect(() => {
    if (energyEntry != null) {
      setHeatingOil(energyEntry.heating_oil);
      setNaturalGas(energyEntry.natural_gas);
      setElectricalConsumption(energyEntry.electricity);
    }
  }, [energyEntry]);

  useEffect(() => {
    void UsersAPI.GetLoggedInUser().then((res) => {
      if (res != null) {
        setUser(res);
      }
    });
    void EnergyAPI.getEnergyMetricForToday().then((res) => {
      if (res != null) {
        setEnergyEntry(res);
      }
    });
  }, [loaded]);

  if (!loaded || user === undefined) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.header}>Calculate your energy consumption:</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>What is your monthly electricity consumption, in kWh:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Input"
            onChangeText={(text) => {
              setElectricalConsumption(Number(text));
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
            placeholder="Input"
            onChangeText={(text) => {
              setNaturalGas(Number(text));
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
            placeholder="Input"
            onChangeText={(text) => {
              setHeatingOil(Number(text));
            }}
          />
        </View>
        <TouchableOpacity style={styles.buttoning} onPress={handleSurveySubmit}>
          <Text style={styles.buttoningText}>Finish!</Text>
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
  header: {
    color: Colors.DARKGREEN,
    fontFamily: 'Montserrat',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 30,
  },
  scrollContainer: {
    paddingTop: 30,
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: Colors.LIGHTFGREEN,
  },
  questionContainer: {
    paddingBottom: 30,
  },
  question: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.DARKGREEN,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.GREY,
    height: 50,
    padding: 8,
    margin: 0,
    width: 200,
    backgroundColor: Colors.WHITE,
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
});
