import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as React from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../../components/types';
import { useFonts } from 'expo-font';
import Colors from '../../../assets/colorConstants';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function EnergyForum(): JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const navigation = useNavigation<StackNavigation>();

  const [province, setProvince] = useState<string>('');
  const [numOfPpl, setNumOfPpl] = useState(0);
  const [electricalConsumption, setElectricalConsumption] = useState(0);
  const [heatingOil, setHeatingOil] = useState(0);
  const [naturalGas, setNaturalGas] = useState(0);

  const handleValueChange = (itemValue: string): void => {
    setProvince(itemValue);
  };

  const handleSurveySubmit = (): void => {
    // Process survey responses, e.g., send them to a server
    console.log('Survey Responses:', {
      province,
      numOfPpl,
      electricalConsumption,
      heatingOil,
      naturalGas,
    });

    navigation.navigate('DashBoard');
  };

  if (!loaded) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.header}>Calculate your energy consumption:</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>Which Province do you live in:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={province}
              style={styles.picker}
              onValueChange={handleValueChange}
            >
              <Picker.Item label="Ontario" value="Ontario" />
              <Picker.Item label="Saskatchewan" value="Saskatchewan" />
              <Picker.Item label="PEI" value="PEI" />
              <Picker.Item label="Nunavut" value="Nunavut" />
              <Picker.Item label="Alberta" value="Alberta" />
              <Picker.Item label="Manitoba" value="Manitoba" />
              <Picker.Item label="Quebec" value="Quebec" />
              <Picker.Item label="Newfoundland and Labrador" value="Newfoundland and Labrador" />
              <Picker.Item label="British Columbia" value="British Columbia" />
              <Picker.Item label="Nova Scotia" value="Nova Scotia" />
              <Picker.Item label="Northwest Territories" value="Northwest Territories" />
              <Picker.Item label="New Brunswick" value="New Brunswick" />
              <Picker.Item label="Yukon" value="Yukon" />
              {/* Add more Picker.Item components for additional options */}
            </Picker>
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>How many people live in your household:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Input"
            onChangeText={(text) => {
              setNumOfPpl(Number(text));
            }}
          />
        </View>

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
  pickerContainer: {
    height: 50,
    width: 250,
    backgroundColor: Colors.WHITE,
    borderColor: Colors.GREY,
    borderRadius: 5,
    borderWidth: 1,
  },
  picker: { height: 50, width: 250 },
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
