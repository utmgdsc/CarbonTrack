import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../assets/colorConstants';
import { useFonts } from 'expo-font';
import {type RootStackParamList} from '../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function SettingsScreen(): JSX.Element {

  const navigation = useNavigation<StackNavigation>();

  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }


  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.buttons} onPress={() => {navigation.navigate('UpdateProfile');}}>
          <Text style={styles.labels}> Edit Profile </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={() => {navigation.navigate('UpdatePassword');}}>
          <Text style={styles.labels}> Update Password </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={() => {navigation.navigate('UpdateHomeInfo');}}>
          <Text style={styles.labels}> Update Home Info </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
          <Text style={styles.labels}> Accessibility </Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.LIGHTFGREEN,
    paddingTop: 40
  },
  buttons:{
    width: '85%', 
    height: 56,
    borderRadius: 15,
    backgroundColor: Colors.TRANSLIGHTGREEN,
    marginVertical: 10,
    justifyContent: 'center',
  }, 
  labels:{
    fontWeight: '600', 
    color: Colors.BLACK,
    fontSize: 18,
    marginLeft: 15,
  },

});