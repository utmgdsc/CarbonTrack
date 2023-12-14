import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Colors from '../../../assets/colorConstants';
import { type RootStackParamList } from '../../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import firebaseService from '../../utilities/firebase';
import { type User } from '../../models/User';
import { UsersAPI } from '../../APIs/UsersAPI';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  onAuthStateChanged,
  getAuth,
} from 'firebase/auth';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function UpdateProfileScreen(): JSX.Element {
  const navigation = useNavigation<StackNavigation>();
  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });
  const [userid, setUserid] = useState<string>('');
  const [rerenderKey, setRerenderKey] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<User | undefined>(undefined);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user === null) {
      navigation.navigate('LogIn');
    }
  });

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      const user = await firebaseService.getFirebaseUser();
      setUserid(user?.uid ?? '');
    };
    void fetchUserData();
  }, [rerenderKey]);

  const handleUpdateHome = async (): Promise<void> => {
    try {
      const user = await firebaseService.getFirebaseUser();

      if (user != null) {
        console.log('update home')
      }
    } catch (error: any) {
      // Log any errors
      console.error('Error updating email in UpdateProfile: ', error);
    }
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

          <Text style={styles.label}> Henlo mate </Text>
          <TextInput
            placeholder="new email"
            defaultValue={loggedUser?.email}
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={() => handleUpdateHome}>
          <Text style={styles.saveButtonText}> Confirm Change </Text>
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
  textInput: {
    paddingHorizontal: 5,
    marginBottom: 30,
    marginTop: 10,
    borderRadius: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: Colors.WHITE,
    color: Colors.WHITE,
    width: 270,
  },
  saveButton: {
    borderRadius: 5,
    alignSelf: 'center',
    top: '20%',
  },
  saveButtonText: {
    color: Colors.LIGHTFGREEN,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '400',
    shadowColor: Colors.LIGHTFGREEN,
  },
});
