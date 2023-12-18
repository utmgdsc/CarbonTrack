import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput,KeyboardAvoidingView, Platform } from 'react-native';
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
import { UsersAPI } from '../../APIs/UsersAPI';
import { type User } from '../../models/User';
import Ionicons from '@expo/vector-icons/Ionicons';


export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function EnergyEntryEdit(): JSX.Element {
  const [energyEntry, setEnergyEntry] = useState<EnergyEntry>();

  const [heatingOilUsage, setHeatingOilUsage] = useState(0);
  const [naturalGasUsage, setNaturalGasUsage] = useState(0);
  const [electricityUsage, setElectricityUsage] = useState(0);

  const [user, setUser] = useState<User | undefined>(undefined);

  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const navigation = useNavigation<StackNavigation>();

  const handleSurveySubmit = (): void => {
    // Process survey responses, e.g., send them to a server
    if (energyEntry != null && user != null) {
      const newEntry: EnergyEntry = {
        _id: energyEntry._id,
        user_id: energyEntry.user_id,
        carbon_emissions: energyEntry.carbon_emissions,
        date: energyEntry.date,
        heating_oil: heatingOilUsage,
        natural_gas: naturalGasUsage,
        electricity: electricityUsage,
        province: user.province,
        household: user.household,
      };
      void EnergyAPI.updateEnergy(newEntry).then(() => {
        navigation.navigate('YourForms');
      });
    }
  };

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color={Colors.DARKDARKGREEN} />
              <Text style={styles.buttonText}> Your Forms </Text>
            </TouchableOpacity>
            <Text style={styles.header}>Calculate Your Energy Emissions!</Text>
            <Text style={styles.note}>Tip💡: Check your monthly bill to find your usage or email your landlord, they should have the information you need. </Text>
            </View>

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
    </KeyboardAvoidingView>
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
    fontSize: 36,
    fontWeight: '700',
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
  headerContainer:{
    top: 20,
    marginBottom: 40
  },  
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: Colors.DARKDARKGREEN,
    fontSize: 16,
    fontWeight: '700',
  },
  note:{
    fontSize: 16, 
    fontWeight: '500',
    marginTop: 10,
    color: Colors.LIGHTBLACK
  },
});
