import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Colors from '../../assets/colorConstants';

interface CustomDropdownProps {
  options: string[];
  onSelect: (selectedItem: string) => void;
}

const CustomDropdown = ({ options, onSelect }: CustomDropdownProps): React.JSX.Element | null => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const handleDropdownToggle = (): void => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionSelect = (option: string): void => {
    setSelectedItem(option); 
    setDropdownVisible(false);
    onSelect(option);
  };

  if (!Array.isArray(options)) {
    console.error('Options must be an array');
    return null;
  }

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={handleDropdownToggle}>
        <Text style={styles.dropdownButtonText}>
          {selectedItem !== '' ? selectedItem : 'Select Province'} 
        </Text>
      </TouchableOpacity>
      {dropdownVisible && (
        <ScrollView style={styles.dropdownList}>
          {options.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleOptionSelect(item)}>
              <Text style={styles.dropdownItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    zIndex: 1,
    flex:1,
  },
  dropdownButton: {
    backgroundColor: Colors.DARKGREEN,
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  dropdownButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  dropdownList: {
    position: 'absolute',
    left: 0,
    maxHeight: 175,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.DARKGREEN,
    backgroundColor: Colors.WHITE,
    opacity:0.8,
    top: '100%'
    
    
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.DARKGREEN,
  },
});

export default CustomDropdown;
