import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import ProfileWidgetBox from '../widgets/profileWidget';
import WidgetBox from '../widgets/widgetBox';
import type { RootStackParamList } from '../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { type User } from '../models/User';
import { UsersAPI } from '../APIs/UsersAPI';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

export default function DashBoardScreen(): JSX.Element {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [photoURL] = useState<string>("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png");

  const navigation = useNavigation<StackNavigation>();

  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  useEffect(() => {
    void UsersAPI.GetLoggedInUser().then((res) => {
      if (res != null) {
        setUser(res);
      }
    });
  }, [loaded]);

  if (!loaded || user === undefined) {
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
            photoURL={photoURL}
            user={user}
            rank={0}            />
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
