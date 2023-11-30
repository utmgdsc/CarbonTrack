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
import { Picker } from '@react-native-picker/picker';
import * as React from 'react';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../components/types';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import { useState } from 'react';
import { CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import transportationQuestions from '../../assets/questions';

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

  const handleValueChange = (itemValue: string): void => {
    setProvince(itemValue);
  };

  const handleSurveySubmit = (): void => {
    // Process survey responses, e.g., send them to a server
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>Province:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={province}
              style={styles.picker}
              onValueChange={handleValueChange}
            >
              <Picker.Item label="Ontario" value="Ontario" />
              <Picker.Item label="Saskatchewan" value="Saskatchewan" />
              <Picker.Item label="PEI" value="PEI" />
              <Picker.Item label="Nunavut" value="Nunavut" />
              <Picker.Item label="Alberta" value="Alberta" />
              <Picker.Item label="Manitoba" value="Manitoba" />
              <Picker.Item label="Quebec" value="Quebec" />
              <Picker.Item label="Newfoundland and Labrador" value="Newfoundland and Labrador" />
              <Picker.Item label="British Columbia" value="British Columbia" />
              <Picker.Item label="Nova Scotia" value="Nova Scotia" />
              <Picker.Item label="Northwest Territories" value="Northwest Territories" />
              <Picker.Item label="New Brunswick" value="New Brunswick" />
              <Picker.Item label="Yukon" value="Yukon" />
              {/* Add more Picker.Item components for additional options */}
            </Picker>
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>How many people live in your household:</Text>
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
        </View>

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
            <Text style={styles.question}>Your vehicle&apos;s fuel efficiency:</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingTop: 30,
    flex: 1,
    paddingHorizontal: 30,
  },
  questionContainer: {
    paddingBottom: 30,
  },
  pickerContainer: {
    height: 50,
    width: 250,
    backgroundColor: Colors.WHITE,
    borderColor: Colors.GREY,
    borderRadius: 5,
    borderBottomWidth: 1,
  },
  picker: { height: 50, width: 250 },
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
