import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { type RootStackParamList } from '../components/types';
import { type StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../assets/colorConstants';
import firebaseService from '../utilities/firebase';
import { createUser } from '../APIs/UsersAPI';
import ObjectID from 'bson-objectid';
import { Formik } from 'formik';
import * as Yup from 'yup';

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
      await firebaseService.createUser(email, password);
      await createUser({
        _id: new ObjectID(),
        full_name: fullName,
        email,
      });
      console.log('User was created succesfully:', email);
      navigation.navigate('DashBoard');
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

              <View style={styles.fieldInputContainer}>
                <View style={styles.textbox}>
                  <TextInput
                    style={styles.textInputBox}
                    placeholder="Full Name"
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    value={values.fullName}
                  />
                </View>

                {(touched.fullName ?? false) && errors.fullName !== undefined && (
                  <Text style={styles.fieldErrorMessage}>{errors.fullName}</Text>
                )}
              </View>

              <View style={styles.fieldInputContainer}>
                <View style={styles.textbox}>
                  <TextInput
                    style={styles.textInputBox}
                    placeholder="Email Address"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                </View>

                {(touched.email ?? false) && errors.email !== undefined && (
                  <Text style={styles.fieldErrorMessage}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.fieldInputContainer}>
                <View style={styles.textbox}>
                  <TextInput
                    style={styles.textInputBox}
                    placeholder="Password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                </View>

                {(touched.password ?? false) && errors.password !== undefined && (
                  <Text style={styles.fieldErrorMessage}>{errors.password}</Text>
                )}
              </View>

              <View style={styles.fieldInputContainer}>
                <View style={styles.textbox}>
                  <TextInput
                    style={styles.textInputBox}
                    placeholder="Repeat password"
                    onChangeText={handleChange('repeatPassword')}
                    onBlur={handleBlur('repeatPassword')}
                    value={values.repeatPassword}
                  />
                </View>

                {(touched.repeatPassword ?? false) && errors.repeatPassword !== undefined && (
                  <Text style={styles.fieldErrorMessage}>{errors.repeatPassword}</Text>
                )}
              </View>

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

// TODO: Make a global stylesheet where you have your primary, secondary, button styles, so
// you don't redefine them every time. DRY principle.

const styles = StyleSheet.create({
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
  textInputBox: {
    flex: 1,
    paddingVertical: 0,
  },
  textbox: {
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingBottom: 8,
    marginBottom: 10,
  },
  fieldInputContainer: {
    marginBottom: 25,
  },
  fieldErrorMessage: {
    color: Colors.ERROR,
    fontSize: 12,
  },
});
