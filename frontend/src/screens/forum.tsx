import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import React, { useState } from 'react';
import { Checkbox } from 'react-native-paper';
import { type RootStackParamList } from '../components/types';
import { type StackNavigationProp } from '@react-navigation/stack';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function Forum(): JSX.Element {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const options = [
    { label: 'Energy', value: 'Energy' },
    { label: 'Food', value: 'Food' },
  ];

  const handleOptionChange = (value: string): void => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  const submitQuestionnaire = (): void => {
    // Handle the submission of the questionnaire
    if (selectedOptions.length > 0) {
      console.log('Selected options:', selectedOptions);
      // You can perform additional actions here, e.g., submit data to a server.
    } else {
      alert('Please select at least one option.');
    }
  };

  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.question}>Which carbon metrics would you like to track? </Text>

      {options.map((option) => (
        <View key={option.value} style={styles.checkboxContainer}>
          <Checkbox.Item
            status={selectedOptions.includes(option.value) ? 'checked' : 'unchecked'}
            onPress={() => {
              handleOptionChange(option.value);
            }}
            label={option.label}
            color={Colors.DARKGREEN}
            labelStyle={styles.answer}
            style={styles.checkboxItem}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={submitQuestionnaire}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: Colors.LIGHTFGREEN,
  },
  question: {
    fontFamily: 'Montserrat',
    fontSize: 25,
    fontWeight: '700',
    color: Colors.DARKGREEN,
    marginBottom: 20,
  },
  answer: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.DARKGREEN,
  },
  button: {
    backgroundColor: Colors.DARKGREEN,
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    color: Colors.WHITE,
  },
  checkboxContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkboxItem: {
    flexDirection: 'row-reverse', // Reverses the direction, placing the checkbox on the left
    justifyContent: 'flex-start', // Aligns the checkbox to the left
  },
});
