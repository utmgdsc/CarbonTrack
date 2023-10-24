import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput,} from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/types'
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import SVGImg from '../../assets/google.svg';


export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function LogInScreen() {
  const navigation = useNavigation<StackNavigation>();

  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
  <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 30}}>
        <Text style={styles.header}> Log In </Text>

        <View style={styles.textbox}>
          <Image
          style={styles.icon}
          source={require('../../assets/email-icon.png')}/>
          <TextInput placeholder='Email ID' style={{flex:1, paddingVertical:0,}} keyboardType='email-address'/>
        </View>

        <View style={styles.textbox}>
          <Image
          style={styles.icon}
          source={require('../../assets/lock-icon.png')}/>
          <TextInput placeholder='Password' style={{flex:1, paddingVertical:0,}} secureTextEntry={true}/>
        </View>

        <TouchableOpacity style={{backgroundColor: '#2E3E36', padding: 18, borderRadius: 10, marginBottom: 20,}}onPress={() => navigation.navigate('DashBoard')}> 
          <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#fff',}}> Log In</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={styles.footer}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerBold}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Or log in with </Text>
        <TouchableOpacity 
          onPress={() => {}}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <SVGImg width={45} height={45} />
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      fontFamily: 'Montserrat', 
      fontSize: 30, 
      fontWeight: '700', 
      marginBottom: 30,
      color: '#2E3E36',
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 5,
    },
    textbox: {
      flexDirection: 'row',
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      paddingBotton: 8,
      marginBottom: 25,
    },
    footer: {
      textAlign: 'center',
      color: '#4B8552',
      marginBottom: 30,
      fontFamily: 'Montserrat',
      fontSize: 18,
    },
    footerBold: {
      textAlign: 'center',
      color: '#2E3E36',
      marginBottom: 30,
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
      fontSize: 18,
    }
  });
  