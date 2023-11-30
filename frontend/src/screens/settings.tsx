import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../assets/colorConstants';


export default function SettingsScreen(): JSX.Element {
  return (
    <View style={styles.container}>
        <Text> Welcome to Settings </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.LIGHTFGREEN,
  },

});
