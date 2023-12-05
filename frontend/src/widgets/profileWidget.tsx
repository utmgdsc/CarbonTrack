import React, { useCallback, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../assets/colorConstants';
import { type profileWidgetBoxProps } from '../components/types';
import { useFonts } from 'expo-font';
import ExpProgressBar from '../components/expProgressBar';
import firebaseService from '../utilities/firebase';
import { useFocusEffect } from '@react-navigation/native';

const ProfileWidgetBox: React.FC<profileWidgetBoxProps> = ({ user }) => {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const fetchProfilePicture = useCallback(async () => {
    try {
      const picture = await firebaseService.getProfilePicture();
      setProfilePicture(picture);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchProfilePicture();
    }, [fetchProfilePicture])
  );

  if (!loaded) {
    return <></>;
  }


  if (!loaded) {
    return <></>;
  }

  return (
    <View style={styles.boxContainer}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        <View style={styles.nameBox}>
          <Text style={styles.name}> {user.full_name} </Text>
          <View style={styles.progressBar}>
            <ExpProgressBar thisUser={user}/>
          </View>
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
    backgroundColor: Colors.TRANSGREENBACK,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 10,
    top: '5%'
  },
  buttonText:{
    color: Colors.WHITE,
  },
  name: {
    fontSize: 20,
    color: Colors.WHITE,
    fontWeight: '700',
  },
  nameBox: {
    top: '20%',
    flex: 2,
    alignItems: 'center'
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'flex-start',
    top: '15%',
    backgroundColor: Colors.TRANSGREENBACK,
  },
  progressBar:{
  }

});

export default ProfileWidgetBox;
