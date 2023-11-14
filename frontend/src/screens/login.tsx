import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import type { RootStackParamList } from '../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import GoogleSVG from '../../assets/toSVG';
import firebaseService from '../utilities/firebase';
import Colors from '../../assets/colorConstants';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function LogInScreen(): JSX.Element {
  const navigation = useNavigation<StackNavigation>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const checkInput = (): void => {
    if (email.trim().length === 0) {
      alert('Please Enter Valid Email');
      return;
    }
    if (password.trim().length === 0) {
      alert('Please Enter Password');
      return;
    }
    void handleLogIn();
  };

  const handleLogIn = async (): Promise<void> => {
    try {
      await firebaseService.signInUser(email, password);
      navigation.navigate('TransportationForum');
    } catch (error) {
      alert('Incorrect Email or password');
    }
  };

  // TODO: Load it at the global level.
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerBox}>
        <Text style={styles.header}> Log In </Text>

        <View style={styles.textbox}>
          <Image style={styles.icon} source={require('../../assets/email-icon.png')} />
          <TextInput
            placeholder="Email ID"
            style={styles.textInputBox}
            onChangeText={(value) => {
              setEmail(value);
            }}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.textbox}>
          <Image style={styles.icon} source={require('../../assets/lock-icon.png')} />
          <TextInput
            placeholder="Password"
            style={styles.textInputBox}
            onChangeText={(value) => {
              setPassword(value);
            }}
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity style={styles.buttoning} onPress={checkInput}>
          <Text style={styles.buttoningText}> Log In</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footer}> Don&apos;t have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignUp');
            }}
          >
            <Text style={styles.footerBold}> Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.altContainer}>
          <View style={styles.altContainerSub} />
          <View>
            <Text style={styles.altContainerText}>Or log in with</Text>
          </View>
          <View style={styles.altContainerFloater} />
        </View>

        <TouchableOpacity onPress={() => {}} style={styles.googleIcon}>
          <GoogleSVG width={45} height={45} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  altContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },
  altContainerFloater: {
    backgroundColor: Colors.DARKLIMEGREEN,
    flex: 1,
    height: 1,
  },
  altContainerSub: {
    backgroundColor: Colors.DARKLIMEGREEN,
    flex: 1,
    height: 1,
  },
  altContainerText: {
    color: Colors.DARKLIMEGREEN,
    fontFamily: 'Montserrat',
    fontSize: 18,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  buttoning: {
    backgroundColor: Colors.DARKGREEN,
    borderRadius: 10,
    marginBottom: 20,
    padding: 18,
  },
  buttoningText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  footer: {
    color: Colors.DARKLIMEGREEN,
    fontFamily: 'Montserrat',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  footerBold: {
    color: Colors.DARKGREEN,
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: Colors.DARKGREEN,
    fontFamily: 'Montserrat',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 30,
  },
  headerBox: {
    paddingHorizontal: 30,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    height: 24,
    marginRight: 5,
    width: 24,
  },
  textInputBox: {
    flex: 1,
    paddingVertical: 0,
  },
  textbox: {
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 25,
    paddingBotton: 8,
  },
});
