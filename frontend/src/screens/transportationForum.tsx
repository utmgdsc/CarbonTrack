import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    Linking,
  } from 'react-native';
  import { CheckBox } from 'react-native-elements';
  import * as React from 'react';
  import Icon from 'react-native-vector-icons/FontAwesome';
  import { useState } from 'react';
  import { type StackNavigationProp } from '@react-navigation/stack';
  import { type RootStackParamList } from '../components/types';
  import { useNavigation } from '@react-navigation/native';
  import { useFonts } from 'expo-font';
  import Colors from '../../assets/colorConstants';
  import transportationQuestions from '../../assets/questions';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import Slider from '@react-native-community/slider';
  
  export type StackNavigation = StackNavigationProp<RootStackParamList>;
  
  export default function TransportationForum(): JSX.Element {
    interface SliderData {
      id: number;
      label: string;
      minValue: number;
      maxValue: number;
      initialValue: number;
    }
  
    const slidersData: SliderData[] = [
      { id: 1, label: 'Car', minValue: 0, maxValue: 800, initialValue: 0 },
      { id: 2, label: 'Bus', minValue: 0, maxValue: 800, initialValue: 0 },
      { id: 3, label: 'Train', minValue: 0, maxValue: 800, initialValue: 0 },
      { id: 4, label: 'Motobike', minValue: 0, maxValue: 800, initialValue: 0 },
      // Add more slider data as needed
    ];
  
    const [sliderValues, setSliderValues] = useState<number[]>(
      slidersData.map((data) => data.initialValue)
    );
  
    const onSliderValueChange = (value: number, index: number): void => {
      const updatedValues = [...sliderValues];
      updatedValues[index] = value;
      setSliderValues(updatedValues);
      switch (index) {
        case 0:
          setCarTravel(value);
          break;
        case 1:
          setBusTravel(value);
          break;
        case 2:
          setTrainTravel(value);
          break;
        case 3:
          setBikeTravel(value);
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
  
    const data = transportationQuestions;
  
    const [responses, setResponses] = useState<string[]>(new Array(data.length).fill(''));
  
    const [fuelType, setFuelType] = useState<string>('');
    const [fuelEfficiency, setFuelEfficiency] = useState(0);
    const [carTravel, setCarTravel] = useState(0);
    const [busTravel, setBusTravel] = useState(0);
    const [trainTravel, setTrainTravel] = useState(0);
    const [bikeTravel, setBikeTravel] = useState(0);
  
    const [modalVisible, setModalVisible] = useState(false);
  
    const handleSurveySubmit = (): void => {
      // Process survey responses, e.g., send them to a server
      console.log('Survey Responses:', {
        fuelType,
        fuelEfficiency,
        carTravel,
        busTravel,
        trainTravel,
        bikeTravel,
      });
  
      navigation.navigate('FoodForum');
    };
  
    const handleOptionSelect = (questionId: number, optionIndex: number): void => {
      const updatedResponses = [...responses];
      updatedResponses[questionId] = data[questionId].options[optionIndex];
      setResponses(updatedResponses);
    };
  
    if (!loaded) {
      return <></>;
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.header}>Calculate your emissions from transportation:</Text>
  
          <View style={styles.questionContainer}>
            <Text style={styles.question}>{data[0].question}</Text>
            {data[0].options.map((option, index) => (
              <CheckBox
                checkedColor={Colors.DARKGREEN}
                textStyle={styles.answer}
                containerStyle={
                  responses[data[0].id] === option ? styles.selectedOption : styles.unSelectedOption
                }
                key={index}
                title={option}
                checked={responses[data[0].id] === option}
                onPress={() => {
                  handleOptionSelect(data[0].id, index);
                  setFuelType(data[0].options[index]);
                }}
              />
            ))}
          </View>
  
          <View style={styles.questionContainer}>
            <View style={styles.questionWithIcon}>
              <Text style={styles.question}>
                Please enter your vehicle&apos;s fuel efficiency. If you don&apos;t have a vehicle,
                enter 0.
              </Text>
              <TouchableOpacity
                style={styles.questionIcon}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Icon name="question-circle" size={30} color={Colors.DARKGREEN} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Input"
              onChangeText={(text) => {
                setFuelEfficiency(Number(text));
              }}
            />
          </View>
  
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
                {slider.label}: {sliderValues[index]} km
              </Text>
              <Slider
                style={styles.silder}
                minimumValue={slider.minValue}
                maximumValue={slider.maxValue}
                step={50}
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
    answer: {
      fontFamily: 'Montserrat',
      fontSize: 17,
      fontWeight: '700',
      color: Colors.DARKGREEN,
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
    selectedOption: {
      backgroundColor: Colors.FILLGREEN,
    },
    unSelectedOption: {
      backgroundColor: Colors.LIGHTFGREEN,
    },
    questionContainer: {
      paddingBottom: 30,
    },
    questionWithIcon: {
      flexDirection: 'row',
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
    questionIcon: {
      marginLeft: 15,
      paddingTop: 5,
    },
    silder: {
      height: 50,
      width: '100%',
    },
  });