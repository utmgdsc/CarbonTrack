import React, {useContext, useState} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput,} from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/types'
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import GoogleSVG from '../../assets/toSVG';
import firebaseService from '../utilities/firebase';



export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function LogInScreen() {
  const navigation = useNavigation<StackNavigation>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkInput = () => {
    if (!email.trim()) {
      alert('Please Enter Valid Email');
      return;
    }
    if (!password.trim()) {
      alert('Please Enter Password');
      return;
    }
    handleLogIn();
  };

  const handleLogIn = async () => {
    try{
        await firebaseService.signInUser(email, password);
        navigation.navigate('TransportationForum');
    } catch(error) {
      alert("Incorrect Email or password");
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
  <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 30}}>
        <Text style={styles.header}> Log In </Text>

        <View style={styles.textbox}>
          <Image
          style={styles.icon}
          source={require('../../assets/email-icon.png')}/>
          <TextInput 
              placeholder='Email ID' 
              style={{flex:1, paddingVertical:0,}} 
              onChangeText={(value) => setEmail(value)} 
              keyboardType='email-address'/>
        </View>

        <View style={styles.textbox}>
          <Image
          style={styles.icon}
          source={require('../../assets/lock-icon.png')}/>
          <TextInput 
            placeholder='Password' 
            style={{flex:1, paddingVertical:0,}} 
            onChangeText={(value) => setPassword(value)} 
            secureTextEntry={true}/>
        </View>

        <TouchableOpacity 
          style={{backgroundColor: '#2E3E36', padding: 18, borderRadius: 10, marginBottom: 20,}}
          onPress={checkInput}> 
          <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#fff',}}> Log In</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={styles.footer}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerBold}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 30,}}>
          <View style={{flex: 1, height: 1, backgroundColor: '#4B8552'}} />
          <View>
            <Text style={{
              textAlign: 'center',
              color: '#4B8552',
              fontFamily: 'Montserrat',
              fontSize: 18,
              marginHorizontal: 5,}}>
                Or log in with 
            </Text>
          </View>
          <View style={{flex: 1, height: 1, backgroundColor: '#4B8552'}} />
        </View>

        <TouchableOpacity 
          onPress={() => {}}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <GoogleSVG width={45} height={45} />
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    color: '#2E3E36', 
    fontFamily: 'Montserrat', 
    fontSize: 30, 
    fontWeight: '700',
    marginBottom: 30,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  textbox: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 25,
    paddingBotton: 8,
  },
  footer: {
    color: '#4B8552',
    fontFamily: 'Montserrat',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  footerBold: {
    color: '#2E3E36',
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  }
});
  