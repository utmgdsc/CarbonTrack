import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,} from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/types'
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';

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
      <View style={{paddingHorizontal: 20}}>

        <View style={{alignItems: 'center',}}>
          <Text style={{ fontFamily: 'Montserrat', fontSize: 30, fontWeight: '700', marginBottom: 30}}> Log In </Text>
        </View>

        <TouchableOpacity style={{backgroundColor: '#2E3E36', padding: 18, borderRadius: 10, marginBottom: 20,}}onPress={() => navigation.navigate('DashBoard')}> 
          <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#fff',}}> Log In</Text>
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
  });
  