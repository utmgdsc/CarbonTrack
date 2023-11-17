import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import WidgetBox from '../widgets/widgetBox';
import ProfileWidgetBox from '../widgets/profileWidget';
import type { RootStackParamList } from '../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function DashBoardScreen(): JSX.Element {
  const navigation = useNavigation<StackNavigation>();

  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });
  if (!loaded) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerBox}>
          <Text style={styles.header}>Dashboard</Text>
        </View>
      </View>

      <View style={styles.profileWidgetContainer}>
        <View style={styles.widgetBoarder}>
          <ProfileWidgetBox
            name="Alexader Almerez"
            pplavatar={
              'https://images.pexels.com/photos/8090137/pexels-photo-8090137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            }
            rank="42"
            level={3}
          />
        </View>
      </View>

      <View style={styles.widgetContainer}>
        <View style={styles.widgetBoarder}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FoodHistory');
            }}
          >
            <WidgetBox title="Food" content="10.6" />
          </TouchableOpacity>
        </View>

        <View style={styles.widgetBoarder}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TransportationHistory');
            }}
          >
            <WidgetBox title="Transportatin" content="12.4" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
  },
  headerBox: {
    backgroundColor: Colors.WHITE,
  },
  headerContainer: {
    alignItems: 'center',
  },
  profileWidgetContainer: {
    padding: 10,
    flexDirection: 'column',
  },
  widgetContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  widgetBoarder: {
    padding: 10,
  },
});
