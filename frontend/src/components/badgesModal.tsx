import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import Colors from '../../assets/colorConstants';
import { UsersAPI } from '../APIs/UsersAPI';
import { type User } from '../models/User';
import BadgesDisplay from './BadgeDisplay';

interface ModalInfoProps {
  modalVisible: boolean;
  hideModal: () => void;
}

const BadgesModal: React.FC<ModalInfoProps> = ({ modalVisible, hideModal }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    void UsersAPI.GetLoggedInUser().then((res) => {
      if (res != null) {
        setUser(res);
      }
    });
  }, []);

  if (user === undefined) {
    return <></>;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={hideModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.heading}>Badges</Text>
          <BadgesDisplay user={user} />
          <Pressable style={styles.closeButton} onPress={hideModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.TRANSGREENLOGOUT,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    height: '30%',
  },
  closeButton: {
    backgroundColor: Colors.DARKGREEN,
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: Colors.WHITE,
  },
  heading: {
    fontSize: 24,
    color: Colors.WHITE,
    marginBottom: 15,
    fontWeight: '700',
  },
});

export default BadgesModal;
