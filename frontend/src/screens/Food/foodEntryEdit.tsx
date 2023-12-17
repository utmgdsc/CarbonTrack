import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../../components/types';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Colors from '../../../assets/colorConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { FoodAPI } from '../../APIs/FoodAPI';
import { type FoodEntry } from '../../models/Food';
import Ionicons from '@expo/vector-icons/Ionicons';


export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function FoodEntryEdit(): JSX.Element {
  interface SliderData {
    id: number;
    label: string;
    minValue: number;
    maxValue: number;
    initialValue: number;
  }

  const [foodEntry, setFoodEntry] = useState<FoodEntry>();

  const [slidersData, setSliderData] = useState<SliderData[]>([]);

  const [beefConsumption, setBeefConsumption] = useState(0);
  const [lambConsumption, setLambConsumption] = useState(0);
  const [porkConsumption, setPorkConsumption] = useState(0);
  const [chickenConsumption, setChickenConsumption] = useState(0);
  const [fishConsumption, setFishConsumption] = useState(0);
  const [cheeseConsumption, setCheeseConsumption] = useState(0);
  const [milkConsumption, setMilkConsumption] = useState(0);
  const [foodWaste, setFoodWaste] = useState(0);

  const onSliderValueChange = (value: number, index: number): void => {
    slidersData[index].initialValue = value;
    switch (index) {
      case 0:
        setBeefConsumption(value);
        break;
      case 1:
        setLambConsumption(value);
        break;
      case 2:
        setPorkConsumption(value);
        break;
      case 3:
        setChickenConsumption(value);
        break;
      case 4:
        setFishConsumption(value);
        break;
      case 5:
        setCheeseConsumption(value);
        break;
      case 6:
        setMilkConsumption(value);
        break;
      case 7:
        setFoodWaste(value);
        break;
      default:
        break;
    }
  };

  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const navigation = useNavigation<StackNavigation>();

  const handleSurveySubmit = (): void => {
    // Process survey responses, e.g., send them to a server
    if (foodEntry != null) {
      const newEntry: FoodEntry = {
        _id: foodEntry._id,
        user_id: foodEntry.user_id,
        carbon_emissions: foodEntry.carbon_emissions,
        date: foodEntry.date,
        beef: beefConsumption,
        lamb: lambConsumption,
        pork: porkConsumption,
        chicken: chickenConsumption,
        fish: fishConsumption,
        cheese: cheeseConsumption,
        milk: milkConsumption,
        food_waste: foodWaste,
      };
      void FoodAPI.updateFood(newEntry).then(() => {
        navigation.navigate('DashBoard');
      });
    }
  };

  useEffect(() => {
    if (foodEntry != null) {
      setSliderData([
        { id: 1, label: 'Beef', minValue: 0, maxValue: 8, initialValue: foodEntry.beef },
        { id: 2, label: 'Lamb', minValue: 0, maxValue: 8, initialValue: foodEntry.lamb },
        { id: 3, label: 'Pork', minValue: 0, maxValue: 8, initialValue: foodEntry.pork },
        { id: 4, label: 'Chicken', minValue: 0, maxValue: 8, initialValue: foodEntry.chicken },
        { id: 5, label: 'Fish', minValue: 0, maxValue: 8, initialValue: foodEntry.fish },
        { id: 6, label: 'Cheese', minValue: 0, maxValue: 8, initialValue: foodEntry.cheese },
      ]);
      setBeefConsumption(foodEntry.beef);
      setLambConsumption(foodEntry.lamb);
      setPorkConsumption(foodEntry.pork);
      setChickenConsumption(foodEntry.chicken);
      setFishConsumption(foodEntry.fish);
      setCheeseConsumption(foodEntry.cheese);
      setMilkConsumption(foodEntry.milk);
      setFoodWaste(foodEntry.food_waste);
    }
  }, [foodEntry]);

  useEffect(() => {
    void FoodAPI.getFoodMetricForToday().then((res) => {
      if (res != null) {
        setFoodEntry(res);
      }
    });
  }, [loaded]);

  if (!loaded || slidersData.length === 0) {
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
            <Text style={styles.header}>Calculate Your Food Emissions!</Text>
            <Text style={styles.note}>Note: 1 serving = 100 g</Text>
          </View>
          

          {slidersData.map((slider, index) => (
            <View style={styles.questionContainer} key={slider.id}>
              <Text style={styles.question}>
                {slider.label}: {slidersData[index].initialValue} Servings
              </Text>
              <Slider
                style={styles.silder}
                minimumValue={slider.minValue}
                maximumValue={slider.maxValue}
                step={1}
                minimumTrackTintColor={Colors.DARKGREEN}
                maximumTrackTintColor={Colors.FILLGREEN}
                thumbTintColor={Colors.WHITE}
                value={slidersData[index].initialValue}
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
              placeholder={String(foodEntry?.milk)}
              onChangeText={(text) => {
                setMilkConsumption(Number(text));
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
              placeholder={String(foodEntry?.food_waste)}
              onChangeText={(text) => {
                setFoodWaste(Number(text) / 100);
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
  headerContainer:{
    marginBottom: 50,
    marginTop: 20,
  },
  header: {
    color: Colors.DARKGREEN,
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 10,
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
  input: {
    borderWidth: 1,
    borderColor: Colors.GREY,
    padding: 8,
    margin: 10,
    width: 200,
    backgroundColor: Colors.WHITE,
  },
  silder: {
    height: 50,
    width: '100%',
  },
  note:{
    fontSize: 16, 
    fontWeight: '500',
    marginTop: 10,
    color: Colors.LIGHTBLACK
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
});
