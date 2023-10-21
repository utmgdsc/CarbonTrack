import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import SignUpScreen from './signup';
import { useNavigation } from '@react-navigation/native';
import AppNavigation from '../components/appNavigation';
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from 'react-native';
import { RootStackParamList } from '../components/types';
import { SafeAreaView } from 'react-native-safe-area-context';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigation>();
  
  return (
  <View style={{flex: 1, justifyContent: 'center'}}>
    <View style={{paddingHorizontal: 20}}>

      <View style={{alignItems: 'center',}}>
        <Text style={{ fontFamily: 'Montserrat', fontSize: 30, marginBottom: 30}}> Carbon Track </Text>
      </View>

      <TouchableOpacity style={{backgroundColor: '#2E3E36', padding: 18, borderRadius: 10, marginBottom: 20,}}onPress={() => navigation.navigate('SignUp')}> 
        <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#fff',}}> Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 3, borderColor: '#2E3E36',}}onPress={() => navigation.navigate('LogIn')}> 
        <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#2E3E36',}}> Log In</Text>
      </TouchableOpacity>
      
    </View>
  </View>
  
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',

    },
  });
  