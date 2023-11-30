/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
    try {
      await firebaseService
        .createUser(email, password)
        .then(async () => {
          await UsersAPI.createUser({
            _id: new ObjectID().toHexString() as unknown as ObjectId,
            full_name: fullName,
            email,
            badges: [],
            friends: [],
            score: 0,
            province: '',
            household: 0,
            fuel_efficiency: 0,
          }).then((res): void => {
            console.log(res);
            if (typeof res === 'string') {
              // TODO: Can we make a warning on the screen using proper design?
              console.warn('User was not created: ' + res);
            } else {
              console.log('User was created succesfully:', email);
              navigation.navigate('SignUpQuestions');
            }
          });
        })
        .catch((err) => {
          console.warn('User was not created: ' + err);
        });
    } catch (error) {
      console.error('Error when creating User:', error);
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
          <View style={styles.headerContainer}>
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
              />

              <FormTextField
                placeholder="Email Address"
                handleChange={handleChange('email')}
                handleBlur={handleBlur('email')}
                value={values.email}
                touchedValue={touched.email}
                errorValue={errors.email}
                secureTextEntry={false}
              />

              <FormTextField
                placeholder="Password"
                handleChange={handleChange('password')}
                handleBlur={handleBlur('password')}
                value={values.password}
                touchedValue={touched.password}
                errorValue={errors.password}
                secureTextEntry={true}
              />

              <FormTextField
                placeholder="Repeat Password"
                handleChange={handleChange('repeatPassword')}
                handleBlur={handleBlur('repeatPassword')}
                value={values.repeatPassword}
                touchedValue={touched.repeatPassword}
                errorValue={errors.repeatPassword}
                secureTextEntry={true}
              />

              <TouchableOpacity style={styles.buttoning} onPress={() => handleSubmit()}>
                <Text style={styles.altContainerText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
  altContainerText: {
    color: Colors.WHITE,
    fontFamily: 'Montserrat',
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
});
