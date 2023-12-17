import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import type { RootStackParamList } from '../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import firebaseService from '../utilities/firebase';
import Colors from '../../assets/colorConstants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormTextField from '../components/forms/formTextField';
import { UsersAPI } from '../APIs/UsersAPI';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export interface LoginScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'LogIn'>; // Specify the type for the navigation prop
}

interface ILogInFields {
  email: string;
  password: string;
}
const LogInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function LogInScreen({ navigation }: LoginScreenProps): JSX.Element {
  const handleLogIn = async (fields: ILogInFields): Promise<void> => {
    const { email, password } = fields;
    try {
      await firebaseService.signInUser(email, password).then(async () => {
        await UsersAPI.GetCurrUserByUID()
          .then((res) => {
            if (res != null) {
              navigation.navigate('MainApp', { screen: 'DashBoard' });
            } else {
              console.warn('User was not logged in: ' + res);
            }
          })
          .catch((err) => {
            console.warn('User was not logged in: ' + err);
          });
      });
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
    <>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LogInSchema}
        onSubmit={async (values) => await handleLogIn(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={[styles.headerContainer, styles.container]}>
            <View style={styles.headerBox}>
              <Text style={styles.header}>Log In</Text>

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

              <TouchableOpacity style={styles.buttoning} onPress={() => handleSubmit()}>
                <Text style={styles.buttoningText}> Log In</Text>
              </TouchableOpacity>

              <View style={styles.footerContainer}>
                <Text style={styles.footer}> Don&apos;t have an account? </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SignUp');
                  }}
                >
                  <Text style={styles.footerBold}>Sign Up!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
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
  container:{
    backgroundColor: Colors.LIGHTFGREEN
  },
  footer: {
    color: Colors.DARKLIMEGREEN,
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '500'
  },
  footerBold: {
    color: Colors.DARKLIMEGREEN,
    textDecorationLine:'underline',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 30,
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  texts:{
    fontSize: 14,
    fontWeight: '600',
    justifyContent: 'center',
  },
});
