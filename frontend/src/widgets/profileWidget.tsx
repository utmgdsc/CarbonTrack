import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../assets/colorConstants';
import { type profileWidgetBoxProps } from '../components/types';
import { useFonts } from 'expo-font';
import { getUserLevel } from '../models/User';

const ProfileWidgetBox: React.FC<profileWidgetBoxProps> = ({ photoURL, user }) => {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }

  return (
    <View style={styles.boxContainer}>
        <Image source={{ uri: photoURL }} style={styles.profilePicture} />
        <View style={styles.nameBox}>
          <Text style={styles.name}> {user.full_name} </Text>
          <Text style={styles.level}> Level: {getUserLevel(user)} </Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button}> 
              <Text style={styles.buttonText} > Badges </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}> 
              <Text style={styles.buttonText}> Rank getUserRank </Text>            
            </TouchableOpacity>
            
          </View>
        </View>
          
          
          
          
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    alignItems: 'center',
    backgroundColor: Colors.DARKGREEN,
    borderRadius: 15,
    justifyContent: 'center',
    height: 350,
    width: 325,
    flexDirection: 'column',
    // ios shadow
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    // andriod shadow
    elevation: 5,
  },
  buttonsContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button:{
    backgroundColor: Colors.DARKTRANS,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 10,
    top: '5%'
  },
  buttonText:{
    color: Colors.WHITE,
  },
  level:{
    fontSize: 16,
    color: Colors.WHITE
  },
  name: {
    fontSize: 20,
    color: Colors.WHITE,
    fontWeight: '700',
  },
  nameBox: {
    top: '20%',
    flex: 1,
    alignItems: 'center'
  },
  profilePicture: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'flex-start',
    top: '15%',

  },
});

export default ProfileWidgetBox;
