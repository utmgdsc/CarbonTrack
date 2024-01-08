import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../../assets/colorConstants';
import { useFonts } from 'expo-font';
import {type RootStackParamList} from '../../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Entypo,FontAwesome, Feather } from '@expo/vector-icons'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseService from '../../utilities/firebase';
import { UsersAPI } from '../../APIs/UsersAPI';
import { type User } from '../../models/User';

export type StackNavigation = StackNavigationProp<RootStackParamList>;
export default function SettingsScreen(): JSX.Element {

  const navigation = useNavigation<StackNavigation>();

  const [user, setUser] = useState<User | undefined>(undefined);


  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user === null) {
      navigation.navigate('Home');
    }
  });

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      void UsersAPI.GetLoggedInUser().then((res) => {
        if (res != null) {
          setUser(res);
        }
      });
    };
    void fetchUserData();
  }, []);

  const handleLogOut =async ():Promise<void> => {
    try{
      if (user !== undefined || user != null){
        await firebaseService.signOutUser();
        console.log("User has been logged out!")
        navigation.navigate('Home');
      }
    } catch(error){
      console.error("Loggint Out Error:", error)
    }
    
  }

  const handleDeleteAccount =async ():Promise<void> => {
    try{
      if (user !== undefined || user != null){
        await UsersAPI.deleteUser(user._id);
        console.log("User has been deleted!")
        navigation.navigate('Home');
      }
    } catch(error){
      console.error("Loggint Out Error:", error)
    }
    
  }




  if (!loaded) {
    return <></>;
  }


  return (
    <View style={styles.container}>

        <View style={styles.buttonsContainer}>
          
          <TouchableOpacity style={styles.buttons} onPress={() => {navigation.navigate('UpdateProfile');}}> 
            <FontAwesome name="user-circle-o" size={24} color={Colors.DARKDARKGREEN} style={styles.icon} />
            <Text style={styles.labels}> Edit Profile </Text>
            <Feather name="edit-2" size={24} color={Colors.DARKDARKGREEN} style={styles.nextButton}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttons} onPress={() => {navigation.navigate('UpdatePassword');}}>
            <Entypo name="key" size={24} color={Colors.DARKDARKGREEN} style={styles.icon} />
            <Text style={styles.labels}>Update Log In Info </Text>
            <Feather name="edit-2" size={24} color={Colors.DARKDARKGREEN} style={styles.nextButton}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttons} onPress={() => {navigation.navigate('UpdateHomeInfo');}}>
            <Entypo name="info-with-circle" size={24} color={Colors.DARKDARKGREEN} style={styles.icon} />
            <Text style={styles.labels}> Update Personal Info </Text>
            <Feather name="edit-2" size={24} color={Colors.DARKDARKGREEN} style={styles.nextButton}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttons}>
            <FontAwesome name="universal-access" size={24} color={Colors.DARKDARKGREEN} style={styles.icon} />
            <Text style={styles.labels}> Accessibility </Text>
            <Feather name="edit-2" size={24} color={Colors.DARKDARKGREEN} style={styles.nextButton}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logOutButton} onPress={() => {void handleLogOut()}}>
            <Text style={styles.logOutLabel}> Log Out </Text>
            <Entypo name="log-out" size={24} color={Colors.WHITE} style={styles.nextButton}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logOutButton} onPress={() => {void handleDeleteAccount()}}>
            <Text style={styles.logOutLabel}> Delete Account </Text>
            <Entypo name="trash" size={24} color={Colors.WHITE} style={styles.nextButton}/>
          </TouchableOpacity>

        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHTFGREEN,
    paddingTop: 40
    
  },
  buttonsContainer:{
    alignItems: 'center',
  },
  buttons:{
    width: '85%', 
    height: 56,
    borderRadius: 15,
    backgroundColor: Colors.TRANSLIGHTGREEN2,
    marginVertical: 10,
    justifyContent: 'center',
  }, 
  labels:{
    fontWeight: '600', 
    color: Colors.DARKDARKGREEN,
    fontSize: 18,
    marginLeft: '14%',
  },
  nextButton:{
    position: 'absolute',
    left: '85%',
  }, 
  logOutButton:{
    width: '60%', 
    height: 56,
    borderRadius: 15,
    backgroundColor: Colors.DARKGREEN,
    top: '50%',
    justifyContent: 'center',
  },
  logOutLabel:{
    fontWeight: '600', 
    fontSize: 18,
    marginLeft: 15,
    color: Colors.WHITE
  },
  icon:{
    position: 'absolute',
    left: '5%',
  }

});