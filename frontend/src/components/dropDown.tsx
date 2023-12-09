import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface DropdownProps {
  items: string[];
  placeholder: string;
  onValueChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ items, placeholder, onValueChange }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<View>(null); // Change null to View

  useEffect(() => {
    if (dropdownRef.current != null) {
      dropdownRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({ top: pageY + height, left: pageX });
      });
    }
  }, [isDropdownVisible]);

  const handleOptionPress = (value: string): void => {
    setSelectedValue(value);
    onValueChange(value);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setDropdownVisible(!isDropdownVisible)}
        ref={dropdownRef as React.RefObject<TouchableOpacity>}
      >
        <View style={styles.selectedValueContainer}>
          <Text style={styles.selectedValue}>{selectedValue ?? placeholder}</Text>
        </View>
      </TouchableOpacity>
  
      {isDropdownVisible && (
        <View style={[styles.modalContainer, { top: dropdownPosition.top + 10, left: dropdownPosition.left }]}>
          <ScrollView>
            {items.map((item) => (
              <TouchableOpacity key={item} onPress={() => handleOptionPress(item)}>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    
  },
  selectedValueContainer: {
    borderWidth: 1,
    borderColor: Colors.GREY,
    padding: 10,
    borderRadius: 5,
  },
  selectedValue: {
    fontSize: 16,
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: Colors.WHITE,
    zIndex: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.DARKLIMEGREEN,
    maxHeight: 150,
    overflow: 'scroll',
    top: 0,
  },
  optionText: {
    fontSize: 18,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.DARKLIMEGREEN,
    width: '100%',
    textAlign: 'center',
  },
});

export default Dropdown;
