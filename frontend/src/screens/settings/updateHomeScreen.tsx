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
  const [newOccupancy, setNewOccupancy] = useState<number>(0);
  const [newFuelEfficeincy, setnewFuelEfficeincy] = useState<number>(0);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userid, setUserid] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFocused2, setIsFocused2] = useState<boolean>(false);
  const [isFocused3, setIsFocused3] = useState<boolean>(false);



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
  }, []);
  console.log(userid)

  const handleFocus = ():void  => {
    setIsFocused(true);
  };

  const handleBlur = ():void => {
    setIsFocused(false);
  };
  const handleFocus2 = ():void  => {
    setIsFocused2(true);
  };

  const handleBlur2 = ():void => {
    setIsFocused2(false);
  };

  const handleFocus3 = ():void  => {
    setIsFocused3(true);
  };

  const handleBlur3 = ():void => {
    setIsFocused3(false);
  };

  const handleUpdateHome = async (): Promise<void> => {
    try {
      console.log('Updating home info');
  
      if (user !== undefined) {
        let updatedUser: User | undefined;
  
        if (newProvince !== '' && newProvince !== user.province) {
          console.log('Updating province');
          updatedUser = await UsersAPI.updateUserProvince(user, newProvince);
          console.log('Updated province:', updatedUser?.province);
        }
  
        if (newOccupancy !== 0 && newOccupancy !== user.household) {
          console.log('Updating occupancy');
          updatedUser = await UsersAPI.updateUser({
            ...user,
            household: newOccupancy,
          });
          console.log('Updated occupancy:', updatedUser?.household);
        }
  
        if (newFuelEfficeincy !== 0 && newFuelEfficeincy !== user.fuel_efficiency) {
          console.log('Updating fuel efficiency');
          updatedUser = await UsersAPI.updateUser({
            ...user,
            fuel_efficiency: newFuelEfficeincy,
          });
          console.log('Updated fuel efficiency:', updatedUser?.fuel_efficiency);
        }
  
        if (updatedUser !== undefined) {
          setUser(updatedUser);
          console.log('User updated:', updatedUser);
        }
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
        
        <View style={styles.textInputFields}>
          <View style={styles.textInputBox}>
            <Text style={styles.label}>How many people live in your home?:</Text>
            <TextInput
              keyboardType="numeric"
              placeholder= {'Currently: '+String(user?.household)}
              placeholderTextColor={Colors.LIGHTBLACK}
              onChangeText={(number) => setNewOccupancy(parseInt(number))}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={[styles.textInput, isFocused && styles.activeTextInput]}
            />
          </View>
          <View style={styles.textInputBox}>
            <Text style={styles.label}>Your Province:</Text>
            <TextInput
              placeholder={'Currently: '+ String(user?.province)}
              placeholderTextColor={Colors.LIGHTBLACK}
              onChangeText={(text) => setNewProvince(text)}
              onFocus={handleFocus2}
              onBlur={handleBlur2}
              style={[styles.textInput, isFocused2 && styles.activeTextInput]}
            />
          </View>
          <View style={styles.textInputBox}>
            <Text style={styles.label}>Your New Fuel Efficiency:</Text>
            <TextInput
              placeholder={'Currently: '+ String(user?.fuel_efficiency)}
              placeholderTextColor={Colors.LIGHTBLACK}
              onChangeText={(number) => setnewFuelEfficeincy(parseInt(number))}
              onFocus={handleFocus3}
              onBlur={handleBlur3}
              style={[styles.textInput, isFocused3 && styles.activeTextInput]}
            />
          </View>
        </View>


        <TouchableOpacity style={styles.saveButton} onPress={()  => { void handleUpdateHome()}}>
          <Text style={styles.saveButtonText}> Confirm Update </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  // Existing styles
  activeTextInput: {
    borderColor: Colors.LIGHTGREENBUTTON,
    borderWidth: 2,
  },
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    left: 20,
    padding: 10,
    position: 'absolute',
    top: 60,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    backgroundColor: Colors.DARKDARKGREEN,
    flexGrow: 1,
  },
  header: {
    color: Colors.WHITE,
    fontSize: 36,
    fontWeight: '700',
    position: 'absolute',
    textAlign: 'center',
    top: 105,
  },
  headerBox: {
    alignItems: 'center',
    paddingBottom: 130,
  },
  label: {
    color: Colors.LIGHTFGREEN,
    fontSize: 18,
    marginBottom: 10,
  },
  profileContainer: {
    backgroundColor: Colors.DARKLIGHTDARKGREEN,
    borderRadius: 20,
    height: 645,
    margin: 40,
    alignSelf: 'center',
    width: '85%',
  },
  saveButton: {
    backgroundColor: Colors.TRANSGREENLOGOUT,
    borderRadius: 8,
    width: 140,
    height: 40,
    left: '50%',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 25,
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center'
    
  },
  textInput: {
    backgroundColor: Colors.DARKDARKGREEN,
    borderColor: Colors.BORDERGREEN,
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.LIGHTFGREEN,
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  textInputBox: {
    alignSelf: 'center',
    marginBottom: 50,
    width: '80%',
  },
  textInputFields:{
    top: '9%'
  },
    

});
// const styles = StyleSheet.create({
//   container: {
// d   flexGrow: 1,
//     backgroundColor: Colors.DARKDARKGREEN,
//   },
//   profileContainer: {
//     height: 645,
//     width: '85%',
//     backgroundColor: Colors.DARKGREEN,
//     borderRadius: 20,
//     alignSelf: 'center',
//     margin: 40,
//   },
//   backButton: {
//     position: 'absolute',
//     top: 60,
//     left: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   buttonText: {
//     fontSize: 16,
//     color: Colors.WHITE,
//     fontWeight: '500',
//   },
//   header: {
//     fontSize: 40,
//     color: Colors.WHITE,
//     position: 'absolute',
//     top: 105,
//     textAlign: 'center',
//     fontWeight: '700',
//   },
//   headerBox: {
//     alignItems: 'center',
//     paddingBottom: 130,
//   },
//   textInputBox: {
//     alignSelf: 'center',
//     top: '10%',
//     padding: 10,
//   },
//   label: {
//     fontSize: 16,
//     opacity: 0.5,
//     color: Colors.WHITE,
//   },
//   saveButton: {
//     borderRadius: 5,
//     alignSelf: 'center',
//     top: '20%',
//   },
//   textInput: {
//     paddingHorizontal: 5,
//     marginBottom: 30,
//     marginTop: 10,
//     borderRadius: 10,
//     fontSize: 16,
//     borderBottomWidth: 1,
//     borderColor: Colors.WHITE,
//     width: 270,
//     color: Colors.WHITE,
//   },
//   saveButtonText: {
//     color: Colors.LIGHTFGREEN,
//     fontSize: 16,
//     textDecorationLine: 'underline',
//     fontWeight: '400',
//     shadowColor: Colors.LIGHTFGREEN,
//   },
// });
