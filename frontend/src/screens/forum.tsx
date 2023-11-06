import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { Button, Checkbox} from 'react-native-paper';
import { RootStackParamList } from '../components/types'
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function Forum() {
    const navigation = useNavigation<StackNavigation>();

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
    const options = [
      { label: 'Energy', value: 'Energy',},
      { label: 'Food', value: 'Food' },
    ];
  
    const handleOptionChange = (value: string) => {
      if (selectedOptions.includes(value)) {
        setSelectedOptions(selectedOptions.filter((item) => item !== value));
      } else {
        setSelectedOptions([...selectedOptions, value]);
      }
    };
  
    const submitQuestionnaire = () => {
      // Handle the submission of the questionnaire
      if (selectedOptions.length > 0) {
        console.log('Selected options:', selectedOptions);
        // You can perform additional actions here, e.g., submit data to a server.
      } else {
        console.log('Please select at least one option.');
      }
    };

  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
  <View style={styles.container}>
    <StatusBar style="auto" />
    <Text style={styles.question}>Which carbon metrics would you like to track? </Text>

    {options.map((option) => (
        <View key={option.value}>
          <Checkbox.Item
            status={selectedOptions.includes(option.value) ? 'checked' : 'unchecked'}
            onPress={() => handleOptionChange(option.value)}
            label={option.label}
            color="#2E3E36"
            labelStyle={styles.answer}
          />
        </View>
      ))}
      <TouchableOpacity 
          style={styles.button}
          onPress={submitQuestionnaire}> 
          <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      {/* <Button mode="contained" onPress={submitQuestionnaire}>
        <Text>Submit</Text>
      </Button> */}

  </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      fontFamily: 'Montserrat', 
      fontSize: 30, 
      fontWeight: '700', 
      color: '#243E36' 
    },
    question: {
      fontFamily: 'Montserrat', 
      fontSize: 25, 
      fontWeight: '700', 
      color: '#243E36' 
    },
    answer: {
      fontFamily: 'Montserrat', 
      fontSize: 20, 
      fontWeight: '700', 
      color: '#243E36' 
    },
    button: {
      backgroundColor: '#2E3E36', 
      padding: 18, 
      borderRadius: 10, 
      marginBottom: 20,
    },
    buttonText: {
      textAlign: 'center', 
      fontWeight: '700', 
      fontSize: 16, 
      color: '#fff',
    }
  });
