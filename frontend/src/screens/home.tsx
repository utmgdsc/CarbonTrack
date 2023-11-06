import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppNavigation from '../components/appNavigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from 'react-native';
import { RootStackParamList } from '../components/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function HomeScreen(): JSX.Element {
  const navigation = useNavigation<StackNavigation>();
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }

  return (
  <View style={styles.pageContainer}>
    <View style={styles.pagePadding}>

      <View style={styles.centering}>
        <Text style={styles.text}> Carbon Track </Text>
      </View>

      <TouchableOpacity style={styles.signUpButtoning} onPress={() => {navigation.navigate('SignUp');}}>
        <Text style={styles.buttoningText}> Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logInButtoning} onPress={() => {navigation.navigate('SignUp');}}> 
        <Text style={styles.logInButtoningText}> Log In</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  buttoningText:{
    color: Colors.WHITE,
    fontFamily: 'Montserrat', 
    fontSize: 16, 
    fontWeight: '700', 
    textAlign: 'center', 
  },

  centering: {
    alignItems: 'center',
  },
  logInButtoning: {
    backgroundColor: Colors.WHITE, 
    borderColor: Colors.DARKGREEN, 
    borderRadius: 10, 
    borderWidth: 3, 
    marginBottom: 20, 
    padding: 15, 
  },
  logInButtoningText: {
    color: Colors.DARKGREEN,
    fontFamily: 'Montserrat', 
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',  
  },
  pageContainer:{
    flex: 1, 
    justifyContent: 'center'
  },
  pagePadding: {
    paddingHorizontal: 20,
  },
  signUpButtoning: {
    backgroundColor: Colors.DARKGREEN, 
    borderRadius: 10, 
    marginBottom: 20, 
    padding: 18,  
  },

  text: {
    fontFamily: 'Montserrat', 
    fontSize: 30, 
    fontWeight: '700', 
    marginBottom: 30
  }

  });
  
