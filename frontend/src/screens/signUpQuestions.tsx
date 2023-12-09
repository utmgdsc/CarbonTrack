import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
} from 'react-native';
import * as React from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../components/types';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import { useState } from 'react';
import { CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import transportationQuestions from '../../assets/questions';

import Dropdown from '../components/dropDown';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function SignUpQuestions(): JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const navigation = useNavigation<StackNavigation>();

  const data = transportationQuestions;

  const [responses, setResponses] = useState<string[]>(new Array(data.length).fill(''));

  const [province, setProvince] = useState<string>('');
  const [numOfPpl, setNumOfPpl] = useState(0);
  const [fuelType, setFuelType] = useState<string>('');
  const [fuelEfficiency, setFuelEfficiency] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);

  const provinces = ['British Columbia', 'Alberta', 'Manitoba', 'Sasketchewan', 'Ontario', 'Quebec', 'Newfoundland and Labrador', 'Prince Edward Island', 'New Brunswick', 'Nova Scotia'];
  const handleDropdownChange = (value: string): void => {
    setProvince(value);
    console.log('Selected value:', province);
  };
  const handleSurveySubmit = (): void => {
    console.log('Survey Responses:', {
      province,
      numOfPpl,
      fuelEfficiency,
      fuelType,
    });

    navigation.navigate('TransportationForum');
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

  const handleOptionSelect = (questionId: number, optionIndex: number): void => {
    const updatedResponses = [...responses];
    updatedResponses[questionId] = data[questionId].options[optionIndex];
    setResponses(updatedResponses);
  };
  

  if (!loaded) {
    return <></>;
  }

  return (
    <ScrollView style={styles.scrollContainer}>

        <Text style={styles.questionText}>What province do you live in? </Text>
        <Dropdown items={provinces} onValueChange={handleDropdownChange} placeholder={'Province'}/>
        <Text style={styles.questionText}>How many people live in your household:</Text>
        <View style={styles.textbox}>
          <TextInput
            style={styles.textInputBox}
            keyboardType="numeric"
            placeholder="Input"
            onChangeText={(text) => {
              setNumOfPpl(Number(text));
            }}
          />
        </View>

        <Text style={styles.questionText}>{data[0].question}</Text>
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

      <View style={styles.questionContainer}>
        <View style={styles.questionWithIcon}>
          <Text style={styles.questionText}>Your vehicle&apos;s fuel efficiency:</Text>
          <TouchableOpacity
            style={styles.questionIcon}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Icon name="question-circle" size={30} color={Colors.DARKGREEN} />
          </TouchableOpacity>
        </View>
        <View style={styles.textbox}>
          <TextInput
            style={styles.textInputBox}
            keyboardType="numeric"
            placeholder="Input"
            onChangeText={(text) => {
              setFuelEfficiency(Number(text));
            }}
          />
        </View>
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
      <TouchableOpacity style={styles.buttoning} onPress={handleSurveySubmit}>
        <Text style={styles.buttoningText}>Complete Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: '40%',
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: Colors.LIGHTFGREEN,
    alignContent: 'center'
  },
  questionContainer: {
    paddingBottom: 30,
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
  selectedOption: {
    backgroundColor: Colors.FILLGREEN,
  },
  unSelectedOption: {},
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
  questionText:{
    color: Colors.DARKGREEN,
    fontSize: 16,
    fontWeight: '600'

  },
  questionIcon: {
    marginLeft: 15,
    paddingTop: 5,
  },
  answer: {
    fontFamily: 'Montserrat',
    fontSize: 17,
    fontWeight: '700',
    color: Colors.DARKGREEN,
  },
  textInputBox: {
    flex: 1,
    paddingVertical: 0,
  },
  textbox: {
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 25,
    paddingBotton: 8,
  },
});
