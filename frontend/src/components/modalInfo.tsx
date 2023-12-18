import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Linking } from 'react-native';
import Colors from '../../assets/colorConstants';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


interface ModalInfoProps {
    modalVisible: boolean;
    hideModal: () => void;
}
const handleOpenURL = ():void => {
    Linking.openURL('https://www.canada.ca/en/environment-climate-change/services/environmental-indicators/global-greenhouse-gas-emissions.html')
        .catch(error => console.error('Failed to open URL', error));
    };

const ModalInfo: React.FC<ModalInfoProps> = ({ modalVisible, hideModal }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={hideModal}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.heading}> 💡Fact: </Text>
                    <Text style={styles.modalText}>
                        Government of Canada (2020) reports the average Canadian carbon footprint is 17.8t t CO₂ per year,
                        (~343.2 kg CO₂/week). 
                    </Text>
                    <Text style={styles.modalText}>
                        Keep in mind Canadians have the SECOND HIGHEST ‼️ carbon footpirnt in the world. 
                    </Text>
                    <Text style={styles.modalText}> How do you compare? </Text>
                    <Text onPress={handleOpenURL} style={styles.link}>
                        Read More
                        <MaterialCommunityIcons name="open-in-new" size={14} color={Colors.LIGHTGREENBACK} />
                    </Text>
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
    },
    modalText: {
        color: Colors.WHITE,
        fontSize: 14,
        marginBottom: 10,
        fontWeight: '500'
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
    heading:{
        fontSize: 24,
        color: Colors.WHITE,
        marginBottom: 15,
        fontWeight: '700'
    }, 
    link:{
        color: Colors.LIGHTGREENBACK,
        fontSize: 14,
        marginBottom: 10,
        fontWeight: '500',
        marginTop: 10,
    }
});

export default ModalInfo;
