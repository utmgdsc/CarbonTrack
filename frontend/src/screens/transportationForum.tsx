import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  ScrollView,
  TextInput,
} from 'react-native';
import * as React from 'react';
import { useState } from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../components/types';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import transportationQuestions from '../../assets/questions';
import { Checkbox } from 'react-native-paper';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function TransportationForum(): JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const data = transportationQuestions;

  /*
  //const currentQuestion = data[0];
  //const options = currentQuestion.options;

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNextQuestion = () => {
    if (currentQuestion < data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null); // Reset selected option for the next question
    } else {
      console.log('Quiz completed!');
    }
  };

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
  };

  //const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  //const [answers, setAnswers] = useState<string[]>(Array((currentQuestion.options).length).fill(''));

  console.log(currentQuestion);
  */
  const [fuelType, setFuelType] = useState<string>('');
  const [fuelEfficiency, setFuelEfficiency] = useState<string>('');
  const [busTravel, setBusTravel] = useState<string>('');
  const [trainTravel, setTrainTravel] = useState<string>('');

  const handleSurveySubmit = () => {
    // Process survey responses, e.g., send them to a server
    console.log('Survey Responses:', { fuelType, fuelEfficiency, busTravel, trainTravel });
  };

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
  };

  if (!loaded) {
    return <></>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Calculate your emissions from transportation:</Text>

      <Text style={styles.question}>{data[0].question}</Text>
      <View style={styles.checkboxContainer}>
        {data[0].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, selectedOption === option ? styles.selectedOption : null]}
            onPress={() => {
              handleOptionPress(option);
              setFuelType(option);
            }}
          >
            <Text style={styles.answer}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.question}>
        Please enter your vehicle's fuel efficiency. If you don't have a a vehicle, enter 0.
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Input"
        onChangeText={(text) => {
          setFuelEfficiency(text);
        }}
      />
    </ScrollView>

    /* <View style={styles.container}>
      <Text style={styles.header}>Calculate your emissions from transportation:</Text>
      <Text style={styles.question}>{data[currentQuestion].question}</Text>
      <View style={styles.checkboxContainer}>
        {data[currentQuestion].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, selectedOption === option ? styles.selectedOption : null]}
            onPress={() => {
              handleOptionPress(option);
            }}
          >
            <Text style={styles.answer}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Next" onPress={handleNextQuestion} />
    </View> */
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: Colors.LIGHTFGREEN,
  },
  header: {
    color: Colors.DARKGREEN,
    fontFamily: 'Montserrat',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 30,
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
  input: {
    borderWidth: 1,
    borderColor: Colors.GREY,
    padding: 8,
    margine: 10,
    width: 200,
    backgroundColor: Colors.WHITE,
  },
  checkboxContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: Colors.FILLGREEN,
    backgroundColorOpacity: 1,
  },
  checkboxItem: {
    flexDirection: 'row-reverse', // Reverses the direction, placing the checkbox on the left
    justifyContent: 'flex-start', // Aligns the checkbox to the left
  },
});
