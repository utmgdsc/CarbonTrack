import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';

export default function App(): JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('./assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('./assets/fonts/JosefinSansThinRegular.ttf'),
  });

  // if (!loaded) {
  //   return null;
  // }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Montserrat', fontSize: 30 }}>Carbon Track </Text>

      <StatusBar style="auto" />
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
