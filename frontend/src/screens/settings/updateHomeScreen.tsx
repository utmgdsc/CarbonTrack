import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Colors from '../../../assets/colorConstants';
import { type RootStackParamList } from '../../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import {type User} from '../../models/User'
import { UsersAPI } from '../../APIs/UsersAPI';
import firebaseService from '../../utilities/firebase';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function UpdateHomeScreen(): JSX.Element {

  const [newProvince, setNewProvince] = useState<string>('');
  const [newOccupancy, setNewOccupancy] = useState<number>();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userid, setUserid] = useState<string>('');
  const [rerenderKey, setRerenderKey] = useState<number>(0);


  const navigation = useNavigation<StackNavigation>();
  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      const user = await firebaseService.getFirebaseUser();
      setUserid(user?.uid ?? '');
      void UsersAPI.GetLoggedInUser().then((res) => {
        if (res != null) {
          setUser(res);
        }
      });
    };
    void fetchUserData();
  }, [rerenderKey]);

  // const handleUpdateHome = async ():Promise<void> => {
  //   try{
  //     console.log('updaing home info')
  //     if (newProvince !== undefined && user !== undefined) {
  //       console.log('updaing province')
  //       const updatedProvincialUser = await UsersAPI.updateUserProvince(user, newProvince);
  //       if (updatedProvincialUser != null) {
  //         setUser(updatedProvincialUser);
  //         console.log('updated province')
  //       }
  //     }
  //     if (newOccupancy !== undefined && user !== undefined){
  //       console.log('updaing occupancy')
  //       const updatedOccupancyUser = await UsersAPI.updateUserOccupancy(user, newOccupancy);
  //       if (updatedOccupancyUser != null){
  //         setUser(updatedOccupancyUser);
  //         console.log('updated occupancy')
  //       }
  //       console.log(user.household);
  //     }
      
  //   }catch(e){
  //     console.error("Updating Home Info error occured:", e);
  //   } 
  //   }


  const handleUpdateHome = async (): Promise<void> => {
    try {
      console.log('Updating home info');
      console.log(newProvince)
      console.log(newOccupancy)
  
      if (newProvince !== '' && user !== undefined) {
        console.log('Updating province');
        const updatedProvincialUser = await UsersAPI.updateUserProvince(user, newProvince);
  
        console.log('Updated user:', updatedProvincialUser);
  
        if (updatedProvincialUser != null) {
          setUser(updatedProvincialUser);
          console.log('Updated province');
        }
      }
  
      if (newOccupancy !== undefined && user !== undefined) {
        console.log('Updating occupancy');
        const updatedOccupancyUser = await UsersAPI.updateUserOccupancy(user, newOccupancy);
  
        console.log('Updated user:', updatedOccupancyUser);
  
        if (updatedOccupancyUser != null) {
          setUser(updatedOccupancyUser);
          console.log('Updated occupancy');
        }
  
        console.log('User household:', updatedOccupancyUser?.household);
      }
    } catch (e) {
      console.error('Updating Home Info error occurred:', e);
    }
    return await Promise.resolve();
  };
  
  
  


  if (!loaded) {
    return <></>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBox}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color={Colors.WHITE} />
          <Text style={styles.buttonText}> Settings </Text>
        </TouchableOpacity>
        <Text style={styles.header}> Update Home Info </Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.textInputBox}>
          <Text style={styles.label}>How many people live in your home?:</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="hi"
            style={styles.textInput}
            onChangeText={(number) => setNewOccupancy(parseInt(number))}
          />
          <Text style={styles.label}>Your Province:</Text>
          <TextInput
            
            placeholder="Eg. ON"
            style={styles.textInput}
            onChangeText={(text) => setNewProvince(text)}
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={()  => { void handleUpdateHome()}}>
          <Text style={styles.saveButtonText}> Confirm Update </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.DARKDARKGREEN,
  },
  profileContainer: {
    height: 645,
    width: '85%',
    backgroundColor: Colors.DARKGREEN,
    borderRadius: 20,
    alignSelf: 'center',
    margin: 40,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.WHITE,
    fontWeight: '500',
  },
  header: {
    fontSize: 40,
    color: Colors.WHITE,
    position: 'absolute',
    top: 105,
    textAlign: 'center',
    fontWeight: '700',
  },
  headerBox: {
    alignItems: 'center',
    paddingBottom: 130,
  },
  textInputBox: {
    alignSelf: 'center',
    top: '10%',
    padding: 10,
  },
  label: {
    fontSize: 16,
    opacity: 0.5,
    color: Colors.WHITE,
  },
  saveButton: {
    borderRadius: 5,
    alignSelf: 'center',
    top: '20%',
  },
  textInput: {
    paddingHorizontal: 5,
    marginBottom: 30,
    marginTop: 10,
    borderRadius: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: Colors.WHITE,
    width: 270,
    color: Colors.WHITE,
  },
  saveButtonText: {
    color: Colors.LIGHTFGREEN,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '400',
    shadowColor: Colors.LIGHTFGREEN,
  },
});
