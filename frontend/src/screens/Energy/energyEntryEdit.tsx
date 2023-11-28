import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
} from 'react-native';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../../components/types';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Colors from '../../../assets/colorConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
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

  const onSliderValueChange = (value: number, index: number): void => {
    slidersData[index].initialValue = value
    switch (index) {
      case 0:
        setHeatingOilUsage(value);
        break;
      case 1:
        setNaturalGasUsage(value);
        break;
      case 2:
        setElectricityUsage(value);
        break;
      case 3:
        setHouseholdUsage(value);
        break;
      default:
        break;
    }
  };

  const openLink = async (url: string): Promise<void> => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error('Cannot open the URL');
    }
  };

  const handleLinkPress = (): void => {
    const url = 'https://fcr-ccc.nrcan-rncan.gc.ca/en';
    openLink(url).catch((error) => {
      console.error('Error opening link:', error);
    });
  };

  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const navigation = useNavigation<StackNavigation>();

  const [modalVisible, setModalVisible] = useState(false);

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
        household: householdUsage
      }
      void EnergyAPI.updateEnergy(newEntry).then(() => {
        navigation.navigate('EnergyHistory');
      })
    }
  };

  useEffect(() => {
    if (energyEntry != null) {
      setSliderData([
        { id: 1, label: 'Heating Oil', minValue: 0, maxValue: 800, initialValue: energyEntry.heating_oil },
        { id: 2, label: 'Natural Gas', minValue: 0, maxValue: 800, initialValue: energyEntry.natural_gas },
        { id: 3, label: 'Electricity', minValue: 0, maxValue: 800, initialValue: energyEntry.electricity },
        { id: 4, label: 'House Hold Members', minValue: 1, maxValue: 10, initialValue: energyEntry.household },
      ])
      setHeatingOilUsage(energyEntry.heating_oil);
      setNaturalGasUsage(energyEntry.natural_gas);
      setElectricityUsage(energyEntry.electricity);
      setHouseholdUsage(energyEntry.household);
    }
  }, [energyEntry])

  useEffect(() => {
    void EnergyAPI.getEnergyMetricForToday().then((res) => {
      if (res != null) {
        setEnergyEntry(res)
      }
    })
  }, [loaded])

  if (!loaded || slidersData.length === 0) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.header}>Calculate your emissions from energy:</Text>

        <Modal transparent={true} visible={modalVisible}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.infoText}>
                If you don&apos;t know your vehicle&apos;s fuel efficiency, it&apos;s available
                online{' '}
                <Text style={styles.linkText} onPress={handleLinkPress}>
                  here
                </Text>
                . Select the &quot;combination&quot; value under Comsumption in L/100km. The average
                fuel consumption of non-plug-in hybrid personal vehicles in Canada is 8.9 L / 100
                km.
              </Text>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Icon name="times-circle" size={30} color={Colors.DARKGREEN} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  modalBackground: {
    backgroundColor: Colors.BLACKTRANS,
    flex: 1,
  },
  modalContainer: {
    backgroundColor: Colors.WHITE,
    marginHorizontal: 50,
    marginVertical: 180,
    padding: 20,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
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
  infoText: {
    fontSize: 20,
    color: Colors.DARKGREEN,
  },
  linkText: {
    color: Colors.BLUE,
  },
  closeIcon: {
    marginLeft: 'auto',
  },
  silder: {
    height: 50,
    width: '100%',
  },
});
