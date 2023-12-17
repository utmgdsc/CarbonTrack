import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import Colors from '../../../assets/colorConstants';
import { type RootStackParamList } from '../../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import firebaseService from '../../utilities/firebase';
import {
  launchImageLibraryAsync,
  type ImagePickerResult,
  MediaTypeOptions,
} from 'expo-image-picker';
import { type User } from '../../models/User';
import { UsersAPI } from '../../APIs/UsersAPI';
import {
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
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [rerenderKey, setRerenderKey] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<User | undefined>(undefined);
  const [newName, setNewName] = useState<string>('');

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

      const userPhotoURL = user?.photoURL ?? null;
      setPhotoURL(userPhotoURL);
      void UsersAPI.GetLoggedInUser().then((res) => {
        if (res != null) {
          setLoggedUser(res);
        }
      });
    };
    void fetchUserData();
  }, [rerenderKey]);

  const handleNewName = async (): Promise<void> => {
    if (newName != null && loggedUser != null) {
      const updatedUser = await UsersAPI.updateUserName(loggedUser, newName);
  
      if (updatedUser != null) {
        setLoggedUser(updatedUser);
        console.log(loggedUser.full_name)
      }
    }
  }

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
          <Text style={styles.buttonText}> Settings </Text>
        </TouchableOpacity>
        <Text style={styles.header}> Update Profile </Text>
      </View>
      <View style={styles.profileContainer}>
        <View>
          <Image source={{ uri: photoURL ?? '' }} style={styles.profilePicture} />
          <View style={styles.semiCircle}>
            <TouchableOpacity onPress={() => {void handleProfilePictureUpload()}}>
              <Text style={styles.editPhotoText}> Edit Photo </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.textInputFields}>
            <View style={styles.textInputBox}>
              <Text style={styles.label}>New Name</Text>
                <TextInput
                  placeholder={loggedUser?.full_name}
                  style={[styles.textInput, newName.length > 0 && styles.activeTextInput]}
                  onChangeText={(text) => setNewName(text)}
                  placeholderTextColor={Colors.LIGHTBLACK}
                />
              <TouchableOpacity 
              style={styles.saveButton} 
              // onPress={() => {void handleNewName()}}
              onPress={() => {
                void (newName.length > 0 && handleNewName());
              }}
              disabled={newName.length === 0} >
                <Text style={styles.saveButtonText}> Update Name </Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </ScrollView>
  ); 
}
//   container: {
//     flexGrow: 1,
//     backgroundColor: Colors.DARKDARKGREEN,
//   },
//   profileContainer: {
//     height: 645,
//     width: '85%',
//     backgroundColor: Colors.DARKLIGHTDARKGREEN,
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
//   profilePicture: {
//     height: 150,
//     width: 150,
//     borderRadius: 75,
//     alignSelf: 'center',
//     top: 60,
//   },
//   semiCircle: {
//     height: 75,
//     width: 150,
//     alignSelf: 'center',
//     backgroundColor: Colors.BLACK,
//     borderBottomLeftRadius: 75,
//     borderBottomRightRadius: 75,
//     position: 'absolute',
//     bottom: 0,
//     opacity: 0.5,
//     top: 135,
//     overflow: 'hidden',
//   },
//   editPhotoText: {
//     fontSize: 14,
//     color: Colors.WHITE,
//     textAlign: 'center',
//     top: 15,
//   },
//   textInputContainer: {
//     alignSelf: 'center',
//     top: '10%',
//     padding: 10,
//   },
//   label: {
//     fontSize: 16,
//     opacity: 0.5,
//     color: Colors.WHITE,
//   },
//   textInput: {
//     paddingHorizontal: 5,
//     marginBottom: 30,
//     marginTop: 10,
//     borderRadius: 10,
//     fontSize: 16,
//     borderBottomWidth: 1,
//     borderColor: Colors.WHITE,
//     color: Colors.WHITE,
//     width: '80%'
//   },
//   saveButton: {
//     borderRadius: 5,
//     alignSelf: 'center',
//     top: '20%',
//     padding: 10,
//   },
//   saveButtonText: {
//     color: Colors.LIGHTFGREEN,
//     fontSize: 16,
//     textDecorationLine: 'underline',
//     fontWeight: '400',
//     shadowColor: Colors.LIGHTFGREEN,
//   },
//   activeTextInput: {
//     borderColor: Colors.LIGHTGREENBUTTON,
//     borderWidth: 2,
//   },

// });

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
  textInputFields:{
    top: '9%'
  },
    profilePicture: {
    height: 150,
    width: 150,
    borderRadius: 75,
    alignSelf: 'center',
    top: 60,
  },
  semiCircle: {
    height: 75,
    width: 150,
    alignSelf: 'center',
    backgroundColor: Colors.BLACK,
    borderBottomLeftRadius: 75,
    borderBottomRightRadius: 75,
    position: 'absolute',
    bottom: 0,
    opacity: 0.5,
    top: 135,
    overflow: 'hidden',
  },
  editPhotoText: {
    fontSize: 14,
    color: Colors.WHITE,
    textAlign: 'center',
    top: 15,
  },

});
