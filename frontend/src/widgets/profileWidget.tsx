import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../assets/colorConstants';
import { type RootStackParamList, type profileWidgetBoxProps } from '../components/types';
import { useFonts } from 'expo-font';
import ExpProgressBar from '../components/expProgressBar';
import firebaseService from '../utilities/firebase';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { UsersAPI } from '../APIs/UsersAPI';
import { type User } from '../models/User';
import BadgesModal from '../components/badgesModal';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

const ProfileWidgetBox: React.FC<profileWidgetBoxProps> = ({ user }) => {
  const navigation = useNavigation<StackNavigation>();
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const [profilePicture, setProfilePicture] = useState<string>(
    'https://cianmaggs.github.io/google-homepage/images/loginbutton.png'
  );

  const fetchProfilePicture = useCallback(async () => {
    try {
      const picture = await firebaseService.getProfilePicture();
      if (picture != null) {
        setProfilePicture(picture);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  }, []);
  const [currUser, setUser] = useState<User | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void fetchProfilePicture();
    }, [fetchProfilePicture])
  );

  useEffect(() => {
    void UsersAPI.GetLoggedInUser().then((res) => {
      if (res != null) {
        setUser(res);
      }
    });
  }, [loaded]);

  if (!loaded || currUser === undefined) {
    return <></>;
  }

  const showModal = (): void => {
    setModalVisible(true);
  };

  const hideModal = (): void => {
    setModalVisible(false);
  };

  return (
    <View style={styles.boxContainer}>
      <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      <View style={styles.nameBox}>
        <Text style={styles.name}> {user.full_name} </Text>
        <View style={styles.progressBar}>
          <ExpProgressBar thisUser={user} />
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={showModal} style={styles.button}>
            <Text style={styles.buttonText}> Badges </Text>
            <BadgesModal modalVisible={modalVisible} hideModal={hideModal} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={() => {
                navigation.navigate('CommunityHub');
              }}
            >
              Access Leaderboard
            </Text>
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
    height: 400,
    width: 350,
    flexDirection: 'column',
    // ios shadow
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    // andriod shadow
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: Colors.DARKLIGHTDARKGREEN,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    top: '5%',
  },
  buttonText: {
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
    alignItems: 'center',
  },
  profilePicture: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'flex-start',
    top: '15%',
    backgroundColor: Colors.TRANSGREENBACK,
  },
  progressBar: {},
});

export default ProfileWidgetBox;
