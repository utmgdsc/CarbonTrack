import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import * as React from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../../components/types';
import { useFonts } from 'expo-font';
import Colors from '../../../assets/colorConstants';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import foodSliderData from '../../../assets/foodQuestions';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { FoodAPI } from '../../APIs/FoodAPI';
import { type FoodEntry } from '../../models/Food';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function FoodForum(): JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const navigation = useNavigation<StackNavigation>();

  const slidersData = foodSliderData;

  const [sliderValues, setSliderValues] = useState<number[]>(
    slidersData.map((data) => data.initialValue)
  );

  const onSliderValueChange = (value: number, index: number): void => {
    const updatedValues = [...sliderValues];
    updatedValues[index] = value;
    setSliderValues(updatedValues);
    switch (index) {
      case 0:
        setBeefServing(value);
        break;
      case 1:
        setLambServing(value);
        break;
      case 2:
        setPorkServing(value);
        break;
      case 3:
        setChickenServing(value);
        break;
      case 4:
        setFishServing(value);
        break;
      case 5:
        setCheeseServing(value);
        break;
      default:
        break;
    }
  };
  const [foodEntry, setFoodEntry] = useState<FoodEntry>();

  const [beefServing, setBeefServing] = useState(0);
  const [lambServing, setLambServing] = useState(0);
  const [porkServing, setPorkServing] = useState(0);
  const [chickenServing, setChickenServing] = useState(0);
  const [cheeseServing, setCheeseServing] = useState(0);
  const [fishServing, setFishServing] = useState(0);
  const [milkServing, setMilkServing] = useState(0);
  const [foodWaste, setFoodWaste] = useState(0);

  const handleSurveySubmit = (): void => {
    // Process survey responses, e.g., send them to a server
    if (foodEntry != null) {
      const newEntry: FoodEntry = {
        _id: foodEntry._id,
        user_id: foodEntry.user_id,
        carbon_emissions: foodEntry.carbon_emissions,
        date: foodEntry.date,
        beef: beefServing,
        lamb: lambServing,
        pork: porkServing,
        chicken: chickenServing,
        fish: fishServing,
        cheese: cheeseServing,
        milk: milkServing,
        food_waste: foodWaste,
      };
      void FoodAPI.updateFood(newEntry).then(() => {
        navigation.navigate('EnergyForum');
      });
    }
  };
  useEffect(() => {
    if (foodEntry != null) {
      setBeefServing(foodEntry.beef);
      setLambServing(foodEntry.lamb);
      setPorkServing(foodEntry.pork);
      setChickenServing(foodEntry.chicken);
      setFishServing(foodEntry.fish);
      setCheeseServing(foodEntry.cheese);
    }
  }, [foodEntry]);

  useEffect(() => {
    void FoodAPI.getFoodMetricForToday().then((res) => {
      if (res != null) {
        setFoodEntry(res);
      }
    });
  }, [loaded]);

  if (!loaded) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.header}>Calculate your emissions from food:</Text>

        <Text style={styles.header}>
          On average, how many servings of the following food do you consume per week (Each serving
          is 100g):
        </Text>

        {slidersData.map((slider, index) => (
          <View style={styles.questionContainer} key={slider.id}>
            <Text style={styles.question}>
              {slider.label}: {sliderValues[index]} Servings
            </Text>
            <Slider
              style={styles.silder}
              minimumValue={slider.minValue}
              maximumValue={slider.maxValue}
              step={1}
              minimumTrackTintColor={Colors.DARKGREEN}
              maximumTrackTintColor={Colors.FILLGREEN}
              thumbTintColor={Colors.WHITE}
              value={sliderValues[index]}
              onValueChange={(value) => onSliderValueChange(value, index)}
            />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{slider.minValue}</Text>
              <Text style={styles.label}>{slider.maxValue}</Text>
            </View>
            {/* You can include additional components related to this slider here */}
          </View>
        ))}

        <View style={styles.questionContainer}>
          <Text style={styles.question}>How many cups of milk do you drink per week:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Input"
            onChangeText={(text) => {
              setMilkServing(Number(text));
            }}
          />
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            On average, how much food waste do you produce, in grams:
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Input"
            onChangeText={(text) => {
              setFoodWaste(Number(text) / 100);
            }}
          />
        </View>

        <TouchableOpacity style={styles.buttoning} onPress={handleSurveySubmit}>
          <Text style={styles.buttoningText}>Next</Text>
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
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
  },
  scrollContainer: {
    paddingTop: 30,
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: Colors.LIGHTFGREEN,
  },
  label: {
    fontSize: 15,
  },
  header: {
    color: Colors.DARKGREEN,
    fontFamily: 'Montserrat',
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 50,
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
    borderColor: Colors.GREY,
    padding: 8,
    margin: 10,
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
  questionContainer: {
    paddingBottom: 30,
  },
  silder: {
    height: 50,
    width: '100%',
  },
});
