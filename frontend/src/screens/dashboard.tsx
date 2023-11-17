import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import { type User } from '../models/User';
import { GetLoggedInUser } from '../APIs/UsersAPI';
import ProfileWidgetBox from '../widgets/profileWidget';
import WidgetBox from '../widgets/widgetBox';

export default function DashBoardScreen(): JSX.Element {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [photoURL] = useState<string>("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png");


  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  useEffect( () => {

    void GetLoggedInUser().then((res) => {
      if (res != null) {
        setUser(res)
      }
    });

  }, [loaded])

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
            <ProfileWidgetBox name="Alexader Almerez" pplavatar={photoURL} rank='42' level={3} />
          </View>
      </View>

      <View style={styles.widgetContainer}>

        <View style={styles.widgetBoarder}>
          <WidgetBox title="Food" content="10.6" />
        </View>

        <View style={styles.widgetBoarder}>
          <WidgetBox title="Transportatoin" content="12.4" />
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
