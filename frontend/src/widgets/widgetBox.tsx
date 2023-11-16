import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../assets/colorConstants';
import { type WidgetBoxProps } from '../components/types';
import { useFonts } from 'expo-font';
export const WidgetBox: React.FC<WidgetBoxProps> = ({ title, content }) => {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  if (!loaded) {
    return <></>;
  }

  return (
    <View style={styles.boxContainer}>
      <Text style={styles.title}> {title} </Text>
      <Text style={styles.content}> {content} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    alignItems: 'center',
    backgroundColor: Colors.DARKGREEN,
    borderRadius: 10,
    justifyContent: 'center',
    height: 150,
    width: 150,
    flexDirection: 'column',
  },
  content: {
    color: Colors.WHITE,
    flex: 1,
    fontSize: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: Colors.WHITE,
    top: 15,
    fontWeight: '700',
  },
});

export default WidgetBox;
