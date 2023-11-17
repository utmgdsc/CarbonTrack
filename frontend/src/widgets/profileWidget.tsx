import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Colors from '../../assets/colorConstants';
import { type profileWidgetBoxProps } from '../components/types';
import { useFonts } from 'expo-font';

const ProfileWidgetBox: React.FC<profileWidgetBoxProps> = ({ pplavatar, name, level, rank }) => {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }

  return (
    <View style={styles.boxContainer}>
        <Image source={{ uri: pplavatar }} style={styles.profilePicture} />
        <View>
          <Text style={styles.name}> {name} </Text>
          <Text style={styles.level}> Level: {level} </Text>
        </View>
        <View>
          <Text style={styles.rank}> {rank} </Text>
        </View>
        
              
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    alignItems: 'center',
    backgroundColor: Colors.DARKGREEN,
    borderRadius: 10,
    justifyContent: 'center',
    height: 300,
    width: 300,
    flexDirection: 'column',
  },
  level:{
    color: Colors.WHITE,
    fontSize: 16,
    flex: 1,
    },
  rank:{
    backgroundColor: Colors.LIGHTFGREEN,
    opacity: 0.2,
    height: 20,
    width: '25%',
    borderRadius: 30,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: Colors.WHITE,
    fontWeight: '700',
    top: '20%',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'flex-start',
    top: '15%',

  },
});

export default ProfileWidgetBox;