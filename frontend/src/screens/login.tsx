import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import type { RootStackParamList } from '../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import firebaseService from '../utilities/firebase';
import Colors from '../../assets/colorConstants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormTextField from '../components/forms/formTextField';
import { UsersAPI } from '../APIs/UsersAPI';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

interface ILogInFields {
  email: string;
  password: string;
}
const LogInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function LogInScreen(): JSX.Element {
  const navigation = useNavigation<StackNavigation>();

  const handleLogIn = async (fields: ILogInFields): Promise<void> => {
    const { email, password } = fields;
    try {
      await firebaseService.signInUser(email, password).then(async () => {
        await UsersAPI.GetLoggedInUser().then((res) => {
          if (res != null) {
            navigation.navigate('DashBoard');
          } else {
            console.warn('User was not logged in: ' + res);
          }
        }).catch((err) => {
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
          <View style={styles.headerContainer}>
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
                  <Text style={styles.footerBold}> Sign Up</Text>
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
