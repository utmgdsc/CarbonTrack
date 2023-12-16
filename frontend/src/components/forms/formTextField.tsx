import * as React from 'react';
import { StyleSheet, Text, View, TextInput, type TextStyle } from 'react-native';
import Colors from '../../../assets/colorConstants';

interface IFormTextFieldProps {
  /* Placeholder text to be displayed in the field */
  placeholder: string;

  /* Value to be displayed in the field */
  value: string;

  /* handleChange function to update value on Formik */
  handleChange: (e: string) => void;

  /* handleBlur function */
  handleBlur: (e: any) => void;

  /* touched value of the field */
  touchedValue: boolean | undefined;

  /* errors value of the field */
  errorValue: string | undefined;

  /* secureTextEntry value - should always be true for passwords */
  secureTextEntry: boolean;

  styling: TextStyle;
}

/**
 * Simple form field that supports Formik that supports error handling and display.
 *
 * Can be used with any form that uses Formik but specifically
 * built for the sign up and login screens.
 * @returns JSX.Element
 */
export default function FormTextField(props: IFormTextFieldProps): JSX.Element {
  const {
    placeholder,
    value,
    handleChange,
    handleBlur,
    touchedValue,
    errorValue,
    secureTextEntry,
    styling,
  } = props;

  return (
    <View style={styles.fieldInputContainer}>
      <View style={styles.textbox}>
        <TextInput
          style={[styles.textInputBox, styling]}
          placeholder={placeholder}
          onChangeText={handleChange}
          onBlur={handleBlur}
          value={value}
          secureTextEntry={secureTextEntry}
          keyboardType='email-address'
        />
      </View>

      {(touchedValue ?? false) && errorValue !== undefined && (
        <Text style={styles.fieldErrorMessage}>{errorValue}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textInputBox: {
    flex: 1,
    paddingVertical: 0,
  },
  textbox: {
    borderBottomColor: Colors.DARKDARKGREEN,
    backgroundColor:Colors.TRANSLIGHTGREEN,
    borderBottomWidth: 2,
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'middle'
  },
  fieldInputContainer: {
    marginBottom: 10,
    
  },
  fieldErrorMessage: {
    color: Colors.ERROR,
    fontSize: 12,
  },
});
