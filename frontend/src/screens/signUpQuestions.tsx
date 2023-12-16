import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Linking,
} from 'react-native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../components/types';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import { CheckBox, Image } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import transportationQuestions from '../../assets/questions';

import CustomDropdown from '../components/dropDown';
import { UsersAPI } from '../APIs/UsersAPI';
import { type User } from '../models/User';

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
  const [user, setUser] = useState<User | undefined>(undefined);

  const [modalVisible, setModalVisible] = useState(false);

  const provinces = [
    'British Columbia',
    'Alberta',
    'Manitoba',
    'Saskatchewan',
    'Ontario',
    'Quebec',
    'Newfoundland and Labrador',
    'Prince Edward Island',
    'New Brunswick',
    'Nova Scotia',
  ];

  const handleSurveySubmit = (): void => {
    console.log('Survey Responses:', {
      province,
      numOfPpl,
      fuelEfficiency,
      fuelType,
    });
    if (user != null) {
      try {
        void UsersAPI.updateUserProvince(user, province);
        void UsersAPI.updateUserOccupancy(user, numOfPpl);
        void UsersAPI.updateUserFuelEfficiency(user, fuelEfficiency);
      } catch (error) {
        // Handle errors if any of the updates fail
        console.error(error);
        // You might want to handle the error or show a message to the user
      }
    }

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

  useEffect(() => {
    void UsersAPI.GetLoggedInUser().then((res) => {
      if (res != null) {
        setUser(res);
      }
    });
  }, [loaded]);

  useEffect(() => {
    console.log('Updated Province:', province);
  }, [province]); // sanity check

  if (!loaded || user === undefined) {
    return <></>;
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.pageHeader}>
        Before jump right in, why don&apos;t we get to know you a little more, {user.full_name}!
      </Text>
      <View style={styles.sectionDiv}>
        <Text style={styles.questionText}>How many people live in your household:</Text>
        <View style={styles.textbox}>
          <TextInput
            style={styles.textInputBox}
            keyboardType="numeric"
            placeholder="Eg. 3"
            onChangeText={(text) => {
              setNumOfPpl(Number(text));
            }}
          />
        </View>
        <View style={styles.provincialContainer}>
          <Text style={styles.questionText}>What province do you live in? </Text>
          <CustomDropdown
            options={provinces}
            onSelect={(selectedProvince: React.SetStateAction<string>) =>
              setProvince(selectedProvince)
            }
          />
          <Image source={{ uri: 'https://pngimg.com/d/frog_PNG3839.png' }} style={styles.frogie} />
        </View>
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
              If you don&apos;t know your vehicle&apos;s fuel efficiency, it&apos;s available online{' '}
              <Text style={styles.linkText} onPress={handleLinkPress}>
                here
              </Text>
              . Select the &quot;combination&quot; value under Consumption in L/100km. The average
              fuel consumption of non-plug-in hybrid personal vehicles in Canada is 8.9 L / 100 km.
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
    backgroundColor: Colors.LIGHTFGREEN,
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingTop: '30%',
    alignContent: 'center',
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
  frogie: {
    width: 192,
    height: 192,
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
    marginVertical: 280,
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
  pageHeader: {
    fontSize: 26,
    fontWeight: '600',
    paddingBottom: 30,
  },
  provincialContainer: {
    paddingBottom: '10%',
  },
  questionText: {
    color: Colors.DARKGREEN,
    fontSize: 16,
    fontWeight: '600',
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
  sectionDiv: {
    margin: 10,
  },
  textInputBox: {
    flex: 1,
    paddingVertical: 2,
    marginTop: 5,
  },
  textbox: {
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 25,
    paddingBottom: 8,
  },
});
