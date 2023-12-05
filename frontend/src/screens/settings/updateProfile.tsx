import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../../../assets/colorConstants';
import type { RootStackParamList } from '../../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import firebaseService from '../../utilities/firebase';
import { launchImageLibraryAsync, type ImagePickerResult, MediaTypeOptions, } from 'expo-image-picker';

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

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      const user = await firebaseService.getFirebaseUser();
      setUserid(user?.uid ?? '');
    };

    void fetchUserData();
  }, [rerenderKey]); 

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
      </View>

      <View style={styles.infoContainer}>
        
      
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.DARKGREEN,
  },
  profileContainer:{
    height: 645, 
    width: '85%',
    backgroundColor: Colors.TRANSGREENBACK, 
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
  infoContainer:{
    padding: 5,
  }


});