import { StyleSheet, Text, View } from 'react-native';
import SignUpScreen from './signup';
import { useNavigation } from '@react-navigation/native';
import AppNavigation from '../components/appNavigation';
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from 'react-native';
import { RootStackParamList } from '../components/types';

export type StackNavigation = StackNavigationProp<RootStackParamList>;
export default function HomeScreen() {
  const navigation = useNavigation<StackNavigation>();
  

  return (
  <View style={styles.container}>
    <Text style={{ fontFamily: 'Montserrat', fontSize: 30 }}> Carbon Track </Text>
    <Button title="Sign Up!" onPress={() => navigation.navigate('SignUp')} />
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
  