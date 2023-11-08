import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import { type User } from '../models/User';
import { GetLoggedInUser } from '../APIs/UsersAPI';

export default function DashBoardScreen(): JSX.Element {
  const [user, setUser] = useState<User | undefined>(undefined);


  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  useEffect( () => {
    // TODO
    void GetLoggedInUser().then((res) => {
      setUser(res)
    });
  }, [loaded])

  if (!loaded || user === undefined) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://lh3.googleusercontent.com/a/ACg8ocJ18KmHRL67wcG46K48ZT_Q7DUlLr7nk8xICk5KEMdLUEoq=s96-c' }}
        style={styles.profilePicture}
      />
      <Text style={styles.name}>{user?.full_name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
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
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make the image circular
  },
  name: {
    color: Colors.DARKLIMEGREEN,
    fontFamily: 'Montserrat',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16, // Add spacing between the elements
  },
  email: {
    color: Colors.DARKLIMEGREEN,
    fontFamily: 'Montserrat',
    fontSize: 16,
    marginTop: 8, // Add spacing between the elements
  },
});
