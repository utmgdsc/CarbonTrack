/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox';
import { useFonts } from 'expo-font';
import { type RootStackParamList } from '../components/types';
import { type StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../assets/colorConstants';
import firebaseService from '../utilities/firebase';
import { UsersAPI } from '../APIs/UsersAPI';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormTextField from '../components/forms/formTextField';
import { type ObjectId } from 'mongodb';
import ObjectID from 'bson-objectid';
import { useState } from 'react';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

interface ISignUpFields {
  fullName: string;
  email: string;
  password: string;
}

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

export default function SignUp(): JSX.Element {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const navigation = useNavigation<StackNavigation>();

  // TODO: fonts should be loaded at the global level, and not at the component level.

  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }

  const handleSignUp = async (fields: ISignUpFields): Promise<void> => {
    const { fullName, email, password } = fields;

    // create user in firebase then flask
    try {
      const userCredentials = await firebaseService.createUser(email, password);

      const res = await UsersAPI.createUser({
        _id: new ObjectID().toHexString() as unknown as ObjectId,
        uid: userCredentials.user?.uid,
        full_name: fullName,
        email,
        badges: [],
        friends: [],
        monthly_score: 0,
        yearly_score: 0,
        overall_score: 0,
        province: '',
        household: 0,
        fuel_efficiency: 0,
        photoURL: '',
        monthly_emissions: 0,
        yearly_emissions: 0,
        overall_emissions: 0,
      });

      if (typeof res === 'string') {
        console.warn('[signup.tsx - handleSignUp] User created not in Flask: ' + res);
      } else {
        console.log('[signup.tsx - handleSignUp] User created in Flask:', res);
        navigation.navigate('Welcome');
      }
    } catch (err) {
      console.error('[signup.tsx - handleSignUp] User not created in Flask:', err);
    }
  };

  return (
    <>
      <Formik
        initialValues={{ fullName: '', email: '', password: '', repeatPassword: '' }}
        validationSchema={SignUpSchema}
        onSubmit={async (values) => await handleSignUp(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={[styles.headerContainer, styles.container]}>
            <View style={styles.headerBox}>
              <Text style={styles.header}>Sign Up</Text>

              <FormTextField
                placeholder="Full Name"
                handleChange={handleChange('fullName')}
                handleBlur={handleBlur('fullName')}
                value={values.fullName}
                touchedValue={touched.fullName}
                errorValue={errors.fullName}
                secureTextEntry={false}
                styling={styles.texts}
              />

              <FormTextField
                placeholder="Email Address"
                handleChange={handleChange('email')}
                handleBlur={handleBlur('email')}
                value={values.email}
                touchedValue={touched.email}
                errorValue={errors.email}
                secureTextEntry={false}
                styling={styles.texts}
              />

              <FormTextField
                placeholder="Password"
                handleChange={handleChange('password')}
                handleBlur={handleBlur('password')}
                value={values.password}
                touchedValue={touched.password}
                errorValue={errors.password}
                secureTextEntry={true}
                styling={styles.texts}
              />

              <FormTextField
                placeholder="Repeat Password"
                handleChange={handleChange('repeatPassword')}
                handleBlur={handleBlur('repeatPassword')}
                value={values.repeatPassword}
                touchedValue={touched.repeatPassword}
                errorValue={errors.repeatPassword}
                secureTextEntry={true}
                styling={styles.texts}
              />

              <View style={styles.checkboxContainer}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                  style={styles.checkbox}
                />
                <Text style={styles.label}>Remember Me</Text>
              </View>

              <TouchableOpacity style={styles.buttoning} onPress={() => handleSubmit()}>
                <Text style={styles.altContainerText}>Next</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.signupLink} onPress={() => navigation.navigate('LogIn')}>
              Already have an account? Log in!
            </Text>
          </View>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    alignSelf: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    margin: 8,
    fontSize: 16,
  },
  altContainerText: {
    color: Colors.WHITE,
    fontSize: 18,
    marginHorizontal: 5,
    textAlign: 'center',
    fontWeight: '700',
  },
  buttoning: {
    backgroundColor: Colors.DARKGREEN,
    borderRadius: 10,
    marginBottom: 20,
    padding: 18,
  },
  texts: {
    fontSize: 14,
    fontWeight: '600',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: Colors.LIGHTFGREEN,
  },
  header: {
    color: Colors.DARKGREEN,
    fontSize: 36,
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
  signupLink: {
    color: Colors.DARKGREEN,
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
