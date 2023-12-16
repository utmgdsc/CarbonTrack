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
import {
  onAuthStateChanged,
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { UsersAPI } from '../../APIs/UsersAPI';
import { type User } from '../../models/User';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function UpdateProfileScreen(): JSX.Element {

  const navigation = useNavigation<StackNavigation>();
  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });
  const [newPass, setNewPass] = useState<string>('');
  const [loggedUser, setLoggedUser] = useState<User | undefined>(undefined);
  const [newEmail, setNewEmail] = useState<string>(''); 
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  

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
          setLoggedUser(res);
        }
      });
    };
    void fetchUserData();
  }, []);


  // useEffect(() => {
  //   const checkAuthState = async (): Promise<void> => {
  //     const currentUser = await firebaseService.getFirebaseUser();
  //     if (currentUser === null) {
  //       navigation.navigate('LogIn');
  //     }
  //   };

  //   const unsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
  //     if (currentUser === null) {
  //       navigation.navigate('LogIn');
  //     } else {
  //       void checkAuthState();
  //     }
  //   });

  //   return () => {
  //     unsubscribe(); // Cleanup on component unmount
  //   };
  // }, [navigation]);

  const handleUpdateEmail = async (): Promise<void> => {
    try {
      const user = await firebaseService.getFirebaseUser();

      if (user != null) {
        const userCreds = await promptUserForCredentials();

        if (userCreds != null && user.email != null) {
          const entireCreds = EmailAuthProvider.credential(user.email, userCreds.password);
          await reauthenticateWithCredential(user, entireCreds).then(async (result) => {
            console.log('Email (should be) sent! Check inbox. ');

            // email update
            await verifyBeforeUpdateEmail(user, newEmail);
            

            // TODO: when Error (auth/missing-new-email).] --make alert (email up to date)
            Alert.alert(
              "Check Your Inbox!",`A verification link has been sent to ${newEmail}! Click the link to verify your email. You will now be looged off.`
            );
            
            await firebaseService.signOutUser();

            navigation.navigate('Home');
          });
        }
      }
    } catch (error: any) {
      // Log any errors
      console.error('Error updating email in UpdateProfile: ', error);
    }
  };
  
  const handleUpdatePassword = async ():Promise<void> => {
    try {
      const user = await firebaseService.getFirebaseUser();
      if (user != null) {
        if (newPass != null && user.email != null) {
          // get user password to reauth
          const userCreds = await promptUserForCredentials();
          if (userCreds != null) {
            const creds = EmailAuthProvider.credential(user.email, userCreds.password);
            // reauth user
            try {
              await reauthenticateWithCredential(user, creds);
  
              // after reauthing, update password
              try {
                await updatePassword(user, newPass);
                Alert.alert('Password Updated Successfully!','You will now be signed out.');
                console.log('Firebase (frontend): Update password success (maybe)');
                // sign out user after changing password
                await firebaseService.signOutUser();
                navigation.navigate('LogIn');
              } catch (updateError: any) {
                console.error('Updating password error:', updateError);
                if (updateError.code === "auth/weak-password") {
                  Alert.alert('Password Too Weak', 'Please make sure your password is at least 6 characters long.');
                }
              }
            } catch (reauthError: any) {
              Alert.alert('Reauthentification Error', 'An error occured trying to reauthorize your account. Please try again.');
              console.error('Reauthenticating user error:', reauthError);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error handling password update: ', error);
    }
    return await Promise.resolve();
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
        <Text style={styles.header}> Update Log In Info </Text>
      </View>
      <View style={styles.profileContainer}>


      <View style={styles.textInputFields}>
        <View style={styles.textInputBox}>
          <Text style={styles.label}>New Email:</Text>
            <TextInput
              placeholder={loggedUser?.email}
              style={[styles.textInput, newEmail.length > 0 && styles.activeTextInput]}
              onChangeText={(text) => setNewEmail(text)}
              placeholderTextColor={Colors.LIGHTBLACK}
            />
          <TouchableOpacity 
          style={styles.saveButton} 
          // onPress={() => {void handleUpdateEmail()}}
          onPress={() => {
            void (newEmail.length > 0 && handleUpdateEmail());
          }}
          disabled={newEmail.length === 0} 
>
            <Text style={styles.saveButtonText}> Update Email </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passInputBox}>
          <Text style={styles.label}>New Password:</Text>
          <TextInput
            placeholder="New Password"
            style={[styles.textInput, newPass?.length > 0 && styles.activeTextInput]}
            onChangeText={(text) => setNewPass(text)}
            placeholderTextColor={Colors.LIGHTBLACK}
            secureTextEntry={!isPasswordVisible}
            />
          <TouchableOpacity
            style={styles.passwordVisibilityButton}
            onPress={() => { setIsPasswordVisible(!isPasswordVisible) }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={24}
              color={Colors.TRANSGREENLOGOUT}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={()  => { void handleUpdatePassword()}}>
            <Text style={styles.saveButtonText}> Update Password </Text>
          </TouchableOpacity>
      </View>


      </View>

{/* 
      <View style={styles.textInputFields}>
        <View style={styles.textInputBox}>
          <Text style={styles.label}>New Password:</Text>
            <TextInput
              placeholder='New Password'
              style={[styles.textInput, newPass.length > 0 && styles.activeTextInput]}
              onChangeText={(text) => setNewPass(text)}
              placeholderTextColor={Colors.LIGHTBLACK}
            />
          <TouchableOpacity 
          style={styles.saveButton} 
          onPress={() => {
            void (newPass.length > 0 && handleUpdatePassword());
          }}
          disabled={newPass.length === 0} 
>
            <Text style={styles.saveButtonText}> Update Password </Text>
          </TouchableOpacity>
        </View>
      </View> */}

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
  passwordVisibilityButton: {
    zIndex: 1, 
    position: 'absolute',
    right: 10,
  },
  // d passwordVisibilityButton: {
  //   zIndex: 1, 
  //   position: 'absolute',
  //   right: 10,
  // },
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
    justifyContent: 'center'
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
  passInputBox: {
    alignSelf: 'center',
    marginBottom: 50,
    width: '80%',
  },
  textInputFields:{
    top: '9%'
  },


});
