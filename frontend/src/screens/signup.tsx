/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { useState } from 'react';
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
import Colors from '../../assets/colorConstants';
// import Svg, { Circle, Rect } from 'react-native-svg';
import GoogleSVG from '../../assets/toSVG';
// import SVGImg from '../../assets/google.svg';
import firebaseService from '../utilities/firebase';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { ifError } from 'assert';
import { createUser } from '../APIs/UsersAPI';
import ObjectID from 'bson-objectid';


export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function SignUp():JSX.Element {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<StackNavigation>();

  const checkInput = (): boolean => {
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
    return <></>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingViewStyle}
      behavior="padding"
    >
      <View style={styles.boxStyling}>
        <Text style={styles.h1}>Sign Up</Text>
        <View style={styles.centering}>
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
          style={styles.buttoning}
          onPress={() => {
            checkInput()
            void handleSignUp().then()
          }}
        >
          <Text style={styles.buttoningText}>
            {' '}
            Next{' '}
          </Text>
        </TouchableOpacity>

        {/* new */}
        <TouchableOpacity
          onPress={() => {}}
          style={styles.googleButtoning}
        >
          <GoogleSVG width={45} height={45} />
        </TouchableOpacity>
      </View>
      {/* /</View> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  boxStyling: { 
    paddingHorizontal: 20, 
  },
  buttoning: {
    backgroundColor: Colors.DARKGREEN,
    borderRadius: 10,  
    marginBottom: 20, 
    padding: 18, 
    
  },
  buttoningText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '700',  
    textAlign: 'center',  
  },
  centering:{
    alignItems: 'center' ,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    // backgroundColor: '#E0EEC6',
    justifyContent: 'center',
  },
  googleButtoning: {
    alignItems: 'center', 
    justifyContent: 'center'
  },
  h1: {
    fontFamily: 'Montserrat',
    fontSize: 26,
    // paddingTop: 0,
    fontWeight: '700',
    marginBottom: 40,
    // textAlignVertical: 'top',
  },
  keyboardAvoidingViewStyle: {
    // flex: 1,
    backgroundColor: Colors.LIGHTFGREEN,
    justifyContent: 'center',
    
  },
  // eslint-disable-next-line react-native/no-color-literals
  txtfielts: {
    backgroundColor: '#fff',
    borderBlockColor: Colors.DARKGREEN,
    borderRadius: 10,
    borderWidth: 2,
    color: Colors.DARKGREEN,
    fontSize: 14,
    height: 40,
    margin: 5,
    padding: 10,
    width: '90%',
    // fontFamily: 'Montserrat',
  },

});
