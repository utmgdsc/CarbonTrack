import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../../components/types';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Colors from '../../../assets/colorConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { TransportationAPI } from '../../APIs/TransportationAPI';
import { type TransportationEntry } from '../../models/Transportation';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function TransportationEntryEdit(): JSX.Element {
  interface SliderData {
    id: number;
    label: string;
    minValue: number;
    maxValue: number;
    initialValue: number;
  }

  const [transportationEntry, setTransportationEntry] = useState<TransportationEntry>();

  const [slidersData, setSliderData] = useState<SliderData[]>([]);

  const [electricCarTravel, setElectricCarTravel] = useState(0);
  const [gasolineCarTravel, setGasolineCarTravel] = useState(0);
  const [busTravel, setBusTravel] = useState(0);
  const [trainTravel, setTrainTravel] = useState(0);
  const [bikeTravel, setBikeTravel] = useState(0);

  const onSliderValueChange = (value: number, index: number): void => {
    slidersData[index].initialValue = value;
    switch (index) {
      case 0:
        setElectricCarTravel(value);
        break;
      case 1:
        setGasolineCarTravel(value);
        break;
      case 2:
        setTrainTravel(value);
        break;
      case 3:
        setBusTravel(value);
        break;
      case 4:
        setBikeTravel(value);
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
    if (transportationEntry != null) {
      const newEntry: TransportationEntry = {
        _id: transportationEntry._id,
        user_id: transportationEntry.user_id,
        bus: busTravel,
        train: trainTravel,
        motorbike: bikeTravel,
        electric_car: electricCarTravel,
        gasoline_car: gasolineCarTravel,
        carbon_emissions: transportationEntry.carbon_emissions,
        date: transportationEntry.date,
      };
      void TransportationAPI.updateTransportation(newEntry).then(() => {
        navigation.navigate('DashBoard');
      });
    }
  };

  useEffect(() => {
    if (transportationEntry != null) {
      setSliderData([
        {
          id: 1,
          label: 'Electric Car',
          minValue: 0,
          maxValue: 800,
          initialValue: transportationEntry.electric_car,
        },
        {
          id: 2,
          label: 'Gasoline Car',
          minValue: 0,
          maxValue: 800,
          initialValue: transportationEntry.gasoline_car,
        },
        {
          id: 3,
          label: 'Train',
          minValue: 0,
          maxValue: 800,
          initialValue: transportationEntry.train,
        },
        { id: 4, label: 'Bus', minValue: 0, maxValue: 800, initialValue: transportationEntry.bus },
        {
          id: 5,
          label: 'Motobike',
          minValue: 0,
          maxValue: 800,
          initialValue: transportationEntry.motorbike,
        },
      ]);
      setElectricCarTravel(transportationEntry.electric_car);
      setGasolineCarTravel(transportationEntry.gasoline_car);
      setBusTravel(transportationEntry.bus);
      setTrainTravel(transportationEntry.train);
      setBikeTravel(transportationEntry.motorbike);
    }
  }, [transportationEntry]);

  useEffect(() => {
    void TransportationAPI.getTransportationMetricForToday().then((res) => {
      if (res != null) {
        setTransportationEntry(res);
      }
    });
  }, [loaded]);

  if (!loaded || slidersData.length === 0) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.header}>Calculate your emissions from transportation:</Text>

        <Text style={styles.header}>
          On average, how much distance do you travel using the following methods per week:
        </Text>

        {slidersData.map((slider, index) => (
          <View style={styles.questionContainer} key={slider.id}>
            <Text style={styles.question}>
              {slider.label}: {slidersData[index].initialValue} km
            </Text>
            <Slider
              style={styles.silder}
              minimumValue={slider.minValue}
              maximumValue={slider.maxValue}
              step={50}
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
