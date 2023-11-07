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
} from 'react-native';
import { useFonts } from 'expo-font';
import { type RootStackParamList } from '../components/types';
import { type StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../assets/colorConstants';
import firebaseService from '../utilities/firebase';
import { createUser } from '../APIs/UsersAPI';
import ObjectID from 'bson-objectid';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function SignUp(): JSX.Element{
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const navigation = useNavigation<StackNavigation>();

  const checkInput = (): boolean => {
    if (email.trim().length === 0) {
      Alert.alert('Please Enter a Valid Email');
      return false;
    } else if (password.trim().length === 0) {
      Alert.alert('Please Enter a Valid Password');
      return false;
    } else if (password !== verifiedPassword) {
      Alert.alert('Please correctly rewrite your Password');
      return false;
    }else {
      return true;
    }
  };

  const handleSignUp = async (): Promise<void> => {
    if (checkInput()) {
      try {
        await firebaseService.createUser(email, password);
        await firebaseService.createUser(email, verifiedPassword);
        await createUser({
          _id: new ObjectID,
          full_name: fullName,
          email
        });
        navigation.navigate('Form');
      } catch (error) {
        console.error('Error when creating User:', error);
      }

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
    <View style={styles.headerContainer}>
    <View style={styles.headerBox}>
      <Text style={styles.header}> Sign Up </Text>

      <View style={styles.textbox}>
        <TextInput
            style={styles.textInputBox}
            placeholder="Full Name"
            value={fullName}
            onChangeText={(fullName) => {setFullName(fullName)}}
          />
      </View>

      <View style={styles.textbox}>
      <TextInput
        style={styles.textInputBox}
        placeholder="Email"
        value={email}
        onChangeText={(email) => {setEmail(email)}}
      />
      </View>
      <View style={styles.textbox}>
      <TextInput
        style={styles.textInputBox}
        placeholder="Password"
        value={password}
        onChangeText={(password) => {setPassword(password)}}
      />
      </View>
      <View style={styles.textbox}>
      <TextInput 
        style={styles.textInputBox} 
        placeholder="Re-enter Password"
        value={verifiedPassword}
        onChangeText={(verifiedPassword) => {setVerifiedPassword(verifiedPassword)}} />
      </View>

      <TouchableOpacity
          style={styles.buttoning}
          onPress={ () => {void handleSignUp();
          }}
        
        >
          <Text style={styles.altContainerText}> Next </Text>
        </TouchableOpacity>
    </View>
  </View>   
  );
}

const styles = StyleSheet.create({
  altContainer: {
    alignItems: 'center',
    backgroundColor: Colors.LIGHTFGREEN,
    flexDirection: 'row', 
    marginBottom: 30,
  },
    
  altContainerFloater:{
    backgroundColor: Colors.DARKLIMEGREEN,
    flex: 1, 
    height: 1, 
  },
  altContainerSub: {
    backgroundColor: Colors.DARKLIMEGREEN,
    flex: 1, 
    height: 1, 
  },
  altContainerText: {
    color: Colors.DARKLIMEGREEN,
    fontFamily: 'Montserrat',
    fontSize: 18,
    marginHorizontal: 5,
    textAlign: 'center',  
  },
  buttoning:{
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
  footer: {
    color: Colors.DARKLIMEGREEN,
    fontFamily: 'Montserrat',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  footerBold: {
    color: Colors.DARKGREEN,
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row', 
    justifyContent: 'center'
  },
  googleIcon:{
    alignItems: 'center', 
    justifyContent: 'center'
  },
  header: {
    color: Colors.DARKGREEN, 
    fontFamily: 'Montserrat', 
    fontSize: 30, 
    fontWeight: '700',
    marginBottom: 30,
  },
  headerBox: {
    paddingHorizontal: 30
  },
  headerContainer:{
    flex: 1,
    justifyContent: 'center'
  },
  icon: {
    height: 24,
    marginRight: 5,
    width: 24,
  },
  textInputBox: {
    flex:1, 
    paddingVertical:0,
  },
  textbox: {
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 25,
    paddingBotton: 8,
  },
});
  