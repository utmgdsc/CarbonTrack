/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useFonts } from 'expo-font';
import { type RootStackParamList } from '../components/types';
import { type StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Rect } from 'react-native-svg';
import GoogleSVG from '../../assets/toSVG';
// import SVGImg from '../../assets/google.svg';
import firebaseService from '../utilities/firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ifError } from 'assert';
import { createUser } from '../APIs/UsersAPI';
import ObjectID from 'bson-objectid';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<StackNavigation>();

  const checkInput = () => {
    if (email.trim().length === 0) {
      Alert.alert('Please Enter a Valid Email');
      return false;
    } else if (password.trim().length === 0) {
      Alert.alert('Please Enter a Valid Password');
      return false;
    } else {
      return true;
    }
  };

  const handleSignUp = async (): Promise<void> => {
    try {
      await firebaseService.createUser(email, password);
      await createUser({
        _id: new ObjectID,
        full_name: fullName,
        email
      })
      navigation.navigate('Form');
    } catch (error) {
      console.error('Error when creating User:', error);
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
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: 'center', backgroundColor: '#E0EEC6' }}
      behavior="padding"
    >
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={styles.h1}>Sign Up</Text>
        <View style={{ alignItems: 'center' }}>
          <TextInput
            style={styles.txtfielts}
            placeholder="Full Name"
            value={fullName}
            onChangeText={(text) => {setFullName(text)}}
          />
          <TextInput
            style={styles.txtfielts}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {setEmail(text)}}
          />
          <TextInput
            style={styles.txtfielts}
            placeholder="Password"
            value={password}
            onChangeText={(text) => {setPassword(text)}}
          />
          <TextInput style={styles.txtfielts} placeholder="Re-enter Password" />
        </View>
        <TouchableOpacity
          style={{ backgroundColor: '#2E3E36', padding: 18, borderRadius: 10, marginBottom: 20 }}
          onPress={() => {
            checkInput()
            void handleSignUp().then()
          }}
        >
          <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#fff' }}>
            {' '}
            Next{' '}
          </Text>
        </TouchableOpacity>

        {/* new */}
        <TouchableOpacity
          onPress={() => {}}
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <GoogleSVG width={45} height={45} />
        </TouchableOpacity>
      </View>
      {/* /</View> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    // backgroundColor: '#E0EEC6',
    justifyContent: 'center',
  },
  h1: {
    fontFamily: 'Montserrat',
    fontSize: 26,
    // paddingTop: 0,
    fontWeight: '700',
    marginBottom: 40,
    // textAlignVertical: 'top',
  },
  // eslint-disable-next-line react-native/no-color-literals
  txtfielts: {
    backgroundColor: '#fff',
    borderBlockColor: '#243E36',
    borderRadius: 10,
    borderWidth: 2,
    color: '#243E36',
    fontSize: 14,
    height: 40,
    margin: 5,
    padding: 10,
    width: '90%',
    // fontFamily: 'Montserrat',
  },
});
