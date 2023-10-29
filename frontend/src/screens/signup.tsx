import * as React from 'react'
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView} from 'react-native';
import { useFonts } from 'expo-font';
import { RootStackParamList } from '../components/types'
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Rect } from 'react-native-svg';
import GoogleSVG from '../../assets/toSVG';
// import SVGImg from '../../assets/google.svg';
import firebaseService from '../utilities/firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ifError } from 'assert';


export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<StackNavigation>();


  const auth = getAuth();

  const checkInput = () => {
    if (!email.trim()) {
      Alert.alert('Please Enter Valid Email');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Please Enter Password');
      return false;
    }
    else {
      handleSignUp();
    }
  }

  const handleSignUp = async () => {
    try{
        await firebaseService.createUser(email, password);
        navigation.navigate('Form');
    } catch(error) {
      console.error('Error when create User:', error);
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
    <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center', backgroundColor: '#E0EEC6',}} behavior="padding">
      
      <View style={{paddingHorizontal: 20}}>
        <Text style={styles.h1} >Sign Up</Text>
        <View style={{alignItems: 'center'}}>
          <TextInput style={styles.txtfielts} placeholder="First Name"/>
          {/* check out Asynch Storage --https://reactnative.dev/docs/asyncstorage */}
          <TextInput style={styles.txtfielts} placeholder="Last Name"/>
          <TextInput style={styles.txtfielts} placeholder="Email" value={email} onChangeText={(text) => setEmail(text)}/>
          <TextInput style={styles.txtfielts} placeholder="Password" value={password} onChangeText={(text) => setPassword(text)}/>
          <TextInput style={styles.txtfielts} placeholder="Re-enter Password"/>
        </View>
        <TouchableOpacity style={{backgroundColor: '#2E3E36', padding: 18, borderRadius: 10, marginBottom: 20,}} onPress={checkInput}> 
          <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#fff',}} > Next </Text>
        </TouchableOpacity>

        {/* new */}
        <TouchableOpacity 
          onPress={() => {}}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <GoogleSVG width={45} height={45} />
        </TouchableOpacity>
        
      </View>
    {/* /</View> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#E0EEC6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtfielts:{
    width: '90%',
    fontSize: 14,
    borderBlockColor: '#243E36',
    borderRadius: 10,
    borderWidth: 2,
    height: 40,
    margin: 5,
    padding: 10,
    color:'#243E36',
    backgroundColor: '#fff',
    // fontFamily: 'Montserrat', 
 
  },
  h1:{
    fontSize: 26, 
    // paddingTop: 0,
    fontWeight: '700', 
    marginBottom: 40,
    fontFamily: 'Montserrat', 
    // textAlignVertical: 'top',
  
  }
});
