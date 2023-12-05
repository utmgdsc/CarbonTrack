import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../assets/colorConstants';


export default function UpdatePasswordScreen(): JSX.Element {

  return (
    <View style={styles.container}>
        <Text> Update Password </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.LIGHTFGREEN,
    paddingTop: 40
  },
});
