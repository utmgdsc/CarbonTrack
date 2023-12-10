import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Modal } from 'react-native';
import Colors from '../../../assets/colorConstants';
import {type RootStackParamList}  from '../../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import firebaseService from '../../utilities/firebase';
import { launchImageLibraryAsync, type ImagePickerResult, MediaTypeOptions, } from 'expo-image-picker';
import { type User } from '../../models/User';
import { UsersAPI } from '../../APIs/UsersAPI';
import { EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail, onAuthStateChanged } from 'firebase/auth';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function UpdateProfileScreen(): JSX.Element {
  const navigation = useNavigation<StackNavigation>();
  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });
  const [userid, setUserid] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [rerenderKey, setRerenderKey] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<User | undefined>(undefined);
  const [newEmail, setNewEmail] = useState<string>('');
  const [newName, setNewName] = useState<string>('');  


  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      const user = await firebaseService.getFirebaseUser();
      setUserid(user?.uid ?? '');

      const userPhotoURL = user?.photoURL ?? null ;
      setPhotoURL(userPhotoURL);
      void UsersAPI.GetLoggedInUser().then((res) => {
        if (res != null) {
          setLoggedUser(res);
        }
      });
    };
    void fetchUserData();
  }, [rerenderKey]); 


  const handleUpdateEmail = async (): Promise<void> => {
    try {
      const user = await firebaseService.getFirebaseUser();
  
      if (user != null) {
        const userCreds = await promptUserForCredentials();
  
        if (userCreds != null && user.email != null) {
          const entireCreds = EmailAuthProvider.credential(user.email, userCreds.password);
          await reauthenticateWithCredential(user, entireCreds);
          console.log(newEmail);
          await verifyBeforeUpdateEmail(user, newEmail);
          await waitForEmailVerification(user);
          await firebaseService.updateUserEmail(user, newEmail);
  
          // this i ask gpt
          // Refresh the ID token after email update
          await user.getIdToken(/* forceRefresh */ true);
          // Update the email on the backend (MongoDB)
          if (loggedUser != null) {
            // Update the user in MongoDB
            await UsersAPI.updateUserEmail(loggedUser._id, newEmail);
          }
        }
      }
    } catch (error: any) {
      // Handle errors...
      console.error('Error updating email:', error);
  
      if (error.code === 'auth/id-token-revoked') {
        // Handle token revocation gracefully
        Alert.alert('Your session has expired. Please sign in again.');
        await firebaseService.signOutUser(); // Sign out locally
        // Navigate to the login or authentication screen
        // Update UI to reflect that the user is not authenticated
        navigation.navigate('LogIn');
      } else {
        Alert.alert('An unexpected error occurred. Please try again.');
        throw error;
      }
    }
  };
  
  
  
  
  
  
  
  
  const waitForEmailVerification = async (user: any): Promise<void> => {
    return await new Promise<void>((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(user, (updatedUser) => {
        if ((updatedUser?.emailVerified) ?? false) {
          unsubscribe();
          resolve();
        }
      }, reject);
    });
  };
  
  


  const promptUserForCredentials = async (): Promise<{ password: string } | null> => {
    return await new Promise((resolve) => {
      Alert.prompt(
        'Reauthentication',
        'Please enter your current password:',
        [
          {
            text: 'Cancel',
            onPress: () => resolve(null),
            style: 'cancel',
          },
          {
            text: 'Submit',
            onPress: (password) => resolve({ password: password ?? '' }),
          },
        ],
        'secure-text'
      );
    });
  };

  const handleProfilePictureUpload = async (): Promise<void> => {
    try {
      const result: ImagePickerResult = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        await firebaseService.uploadProfilePicture(userid, result.assets[0].uri);
        setPhotoURL(result.assets[0].uri);
        setRerenderKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      console.error('Error occurred while selecting profile picture:', error);
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
        <Text style={styles.buttonText} > Settings </Text>
      </TouchableOpacity>
        <Text style={styles.header}> Update Profile </Text>
      </View>
      <View style={styles.profileContainer}>
        <View>
          <Image source={{ uri: photoURL }} style={styles.profilePicture} />
          <View style={styles.semiCircle}>
            <TouchableOpacity onPress={handleProfilePictureUpload}>
              <Text style={styles.editPhotoText}> Edit Photo </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.textInputBox}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="new name"
              defaultValue={loggedUser?.full_name}
              style={styles.textInput}
              onChangeText={(text) => setNewName(text)}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="new email"
              defaultValue={loggedUser?.email}
              style={styles.textInput}
              onChangeText={(text) =>setNewEmail(text)}
            />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdateEmail}> 
          <Text style={styles.saveButtonText}> Update Profile </Text>
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
  profileContainer:{
    height: 645, 
    width: '85%',
    backgroundColor: Colors.DARKGREEN, 
    borderRadius: 20,  
    alignSelf: 'center',
    margin: 40
  }, 
  backButton:{
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
    
  }, 
  buttonText:{
    fontSize: 16,
    color: Colors.WHITE,
    fontWeight: '500'
  },
  header:{
    fontSize: 40,
    color: Colors.WHITE,
    position: 'absolute',
    top: 105,
    textAlign: 'center',
    fontWeight: '700'
  }, 
  headerBox:{
    alignItems: 'center',
    paddingBottom: 130
  }, 
  profilePicture:{
    height: 150,
    width: 150, 
    borderRadius: 75,
    alignSelf: 'center',
    top: 60
  },  
  semiCircle: {
    height: 75,
    width: 150,
    alignSelf: 'center',
    backgroundColor: Colors.BLACK,
    borderBottomLeftRadius: 75,
    borderBottomRightRadius:75,
    position: 'absolute',
    bottom: 0,
    opacity: 0.5,
    top: 135,
    overflow: 'hidden',
  },
  editPhotoText:{
    fontSize: 14, 
    color: Colors.WHITE,
    textAlign: 'center',
    top: 15,
  },
  textInputBox:{
    alignSelf: 'center', 
    top: '10%',
    padding: 10,
  }, 
  label:{
    fontSize: 16, 
    opacity: 0.5,
    color: Colors.WHITE
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
    width: 270
  },
  saveButton: {
    borderRadius: 5,
    alignSelf: 'center',
    top: '20%',
  },
  saveButtonText:{
    color: Colors.LIGHTFGREEN, 
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '400',
    shadowColor: Colors.LIGHTFGREEN,
    

  }



});