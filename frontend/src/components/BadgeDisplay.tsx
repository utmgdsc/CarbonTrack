import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  type ImageSourcePropType,
} from 'react-native';
import { type User } from '../models/User';
import Colors from '../../assets/colorConstants';

const BadgesDisplay: React.FC<{ user: User }> = ({ user }) => {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  // Object mapping each badge to its respective image and description
  const badgeData: Record<string, { image: ImageSourcePropType; description: string }> = {
    completed_your_first_weekly_entry: {
      image: require('../../assets/complete-first-badge.png'),
      description: 'Completed your first weekly entry!',
    },
    completed_10_weekly_entries: {
      image: require('../../assets/complete-10-badge.png'),
      description: 'Completed 10 weekly entry!',
    },
    completed_50_weekly_entries: {
      image: require('../../assets/complete-50-badge.png'),
      description: 'Completed 50 weekly entry!',
    },
    completed_100_weekly_entries: {
      image: require('../../assets/complete-100-badge.png'),
      description: 'Completed 100 weekly entry!',
    },
    decreased_emissions_for_first_time: {
      image: require('../../assets/improve-footprint-badge.png'),
      description: 'Decreased your carbon emissions for the first time!',
    },
    // Add more badges as needed
  };

  const handleBadgePress = (badge: string): void => {
    setSelectedBadge(badge);
  };

  const handleCloseModal = (): void => {
    setSelectedBadge(null);
  };

  return (
    <View style={styles.container}>
      {user.badges.map((badge, index) => {
        const badgeInfo = badgeData[badge];
        if ((badgeInfo?.description).length === 0) return null;

        return (
          <TouchableOpacity
            key={index}
            style={styles.badgeTouchable}
            onPress={() => handleBadgePress(badge)}
          >
            <Image source={badgeInfo.image} style={styles.badgeImage} />
          </TouchableOpacity>
        );
      })}

      <Modal transparent={true} visible={selectedBadge !== null} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedBadge != null && (
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{badgeData[selectedBadge].description}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  badgeTouchable: {
    width: 50, // Set the width and height to match your badge image size
    height: 50,
    margin: 5,
  },
  badgeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Adjust the image style as needed
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.LIGHTFGREEN,
    padding: 20,
    borderRadius: 10,
    width: '60%',
  },
  modalText: {
    color: Colors.DARKGREEN,
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
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
});

export default BadgesDisplay;
