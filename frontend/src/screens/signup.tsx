import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/types'
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function SignUp() {
  const navigation = useNavigation<StackNavigation>();
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#E0EEC6',}}>
      
      <View style={{paddingHorizontal: 20}}>
        <Text style={styles.h1} >Sign Up</Text>
        <View style={{alignItems: 'center'}}>
          <TextInput style={styles.txtfielts} placeholder="First Name"/>
          {/* check out Asynch Storage --https://reactnative.dev/docs/asyncstorage */}
          <TextInput style={styles.txtfielts} placeholder="Last Name"/>
          <TextInput style={styles.txtfielts} placeholder="Email"/>
          <TextInput style={styles.txtfielts} placeholder="Password"/>
          <TextInput style={styles.txtfielts} placeholder="Re-enter Password"/>
        </View>
        <TouchableOpacity style={{backgroundColor: '#2E3E36', padding: 18, borderRadius: 10, marginBottom: 20,}}onPress={() => navigation.navigate('Form')}> 
          <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#fff',}}> Next </Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#E0EEC6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtfielts:{
    width: '90%',
    fontSize: 14,
    borderBlockColor: '#243E36',
    borderRadius: 10,
    borderWidth: 2,
    height: 40,
    margin: 5,
    padding: 10,
    color:'#243E36',
    backgroundColor: '#fff',
    // fontFamily: 'Montserrat', 
 
  },
  h1:{
    fontSize: 26, 
    // paddingTop: 0,
    fontWeight: '700', 
    marginBottom: 40,
    fontFamily: 'Montserrat', 
    // textAlignVertical: 'top',
  
  }
});
