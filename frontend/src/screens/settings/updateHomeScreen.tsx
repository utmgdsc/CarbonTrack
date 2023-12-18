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
import CustomDropdown from '../../components/dropDown';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function UpdateHomeScreen(): JSX.Element {

  const [newProvince, setNewProvince] = useState<string>('');
  const [newOccupancy, setNewOccupancy] = useState<number>(0);
  const [newFuelEfficeincy, setnewFuelEfficeincy] = useState<number>(0);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userid, setUserid] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFocused3, setIsFocused3] = useState<boolean>(false);



  const navigation = useNavigation<StackNavigation>();
  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });
  const provinces = [
    'British Columbia',
    'Alberta',
    'Manitoba',
    'Saskatchewan',
    'Ontario',
    'Quebec',
    'Newfoundland and Labrador',
    'Prince Edward Island',
    'New Brunswick',
    'Nova Scotia',
    'Nunavut',
    'Yukon',
    'Northwest Territories'
  ];

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
        let updatedUser: User | undefined = { ...user };

        if (newProvince !== '' && newProvince !== user.province) {
          console.log('Updating province');
          updatedUser.province = newProvince;
        }

        if (newOccupancy !== 0 && newOccupancy !== user.household) {
          console.log('Updating occupancy');
          updatedUser.household = newOccupancy;
        }

        if (newFuelEfficeincy !== 0 && newFuelEfficeincy !== user.fuel_efficiency) {
          console.log('Updating fuel efficiency');
          updatedUser.fuel_efficiency = newFuelEfficeincy;
        }

        // Now update the user with all the changed fields
        updatedUser = await UsersAPI.updateUser(updatedUser);

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
              placeholder= {"Currently:String(user?.household) L/100km"}
              placeholderTextColor={Colors.LIGHTBLACK}
              onChangeText={(number) => setNewOccupancy(parseInt(number))}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={[styles.textInput, isFocused && styles.activeTextInput]}
            />
          </View>
          <View style={styles.textInputBox}>
            <Text style={styles.label}>Your New Fuel Efficiency:</Text>
            <TextInput
              placeholder={'Currently: '+ String(user?.fuel_efficiency)}
              placeholderTextColor={Colors.LIGHTBLACK}
              onChangeText={(number) => setnewFuelEfficeincy(parseFloat(number))}
              onFocus={handleFocus3}
              onBlur={handleBlur3}
              style={[styles.textInput, isFocused3 && styles.activeTextInput]}
            />
          </View>
          <View style={styles.textInputBox}>
            <Text style={styles.label}>Your Province/Territory:</Text>
            <Text style={styles.sublable}>Currently: {user?.province}</Text>
            
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={()  => { void handleUpdateHome()}}>
          <Text style={styles.saveButtonText}> Confirm Changes </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dropDown}>
        <CustomDropdown
          options={provinces}
          onSelect={(selectedProvince: React.SetStateAction<string>) => setNewProvince(selectedProvince)}
        />
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
    zIndex:1
  },
  saveButton: {
    backgroundColor: Colors.TRANSGREENLOGOUT,
    borderRadius: 8,
    width: 140,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: '10%',
    bottom: '20%'
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
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
    marginBottom: 40,
    width: '80%',
  },
  textInputFields:{
    top: '9%'
  },
  sublable:{
    fontSize: 12,
    left: 10,
    color: Colors.WHITE,
    opacity: 0.8,
    fontWeight: '500'
  }, 
  dropDown:{
    position: 'absolute',
    top: '65%',
    zIndex:1,
    width: '70%',
    alignSelf: 'center',
  }
    

});